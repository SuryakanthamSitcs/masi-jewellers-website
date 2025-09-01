use axum::{
    extract::{State, Path, Query},
    http::{header, StatusCode, Method},
    response::Json,
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, postgres::PgPoolOptions};
use std::{sync::Arc, collections::HashMap};
use tower_http::cors::{CorsLayer, Any};
use tracing::info;

#[derive(Clone)]
struct AppState {
    db: PgPool,
}

// Existing structs
#[derive(Serialize)]
struct HealthResponse {
    status: String,
    message: String,
    timestamp: chrono::DateTime<chrono::Utc>,
    database: String,
}

#[derive(Serialize, sqlx::FromRow)]
struct Product {
    id: i32,
    name: String,
    metal_type: String,
    weight_grams: f64,
    making_charges: Option<f64>,
    current_price: Option<f64>,
    stock_quantity: Option<i32>,
    hallmark_number: Option<String>,
}

#[derive(Serialize, sqlx::FromRow)]
struct MetalRate {
    id: i32,
    metal_type: String,
    rate_per_gram: f64,
    date: chrono::NaiveDate,
}

// New Customer struct
#[derive(Serialize, sqlx::FromRow)]
struct Customer {
    id: i32,
    name: String,
    phone: String,
    email: Option<String>,
    customer_type: Option<String>,
    kyc_verified: Option<bool>,
    total_purchases: Option<f64>,
    created_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Deserialize)]
struct CustomerSearch {
    search: Option<String>,
}

// Existing handlers
async fn health_check(State(state): State<Arc<AppState>>) -> Result<Json<HealthResponse>, StatusCode> {
    let db_status = match sqlx::query("SELECT 1").fetch_one(&state.db).await {
        Ok(_) => "connected",
        Err(_) => "disconnected",
    };
    let response = HealthResponse {
        status: "healthy".to_string(),
        message: "🏪 Masi Jewellers Backend Running!".to_string(),
        timestamp: chrono::Utc::now(),
        database: db_status.to_string(),
    };
    
    info!("Health check requested - DB: {}", db_status);
    Ok(Json(response))
}

async fn get_products(State(state): State<Arc<AppState>>) -> Result<Json<Vec<Product>>, StatusCode> {
    let products = sqlx::query_as::<_, Product>(
        "SELECT id, name, metal_type, CAST(weight_grams AS FLOAT) as weight_grams, 
         CAST(making_charges AS FLOAT) as making_charges, CAST(current_price AS FLOAT) as current_price, 
         stock_quantity, hallmark_number FROM products ORDER BY created_at DESC"
    )
    .fetch_all(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    
    info!("Products requested - found {} items", products.len());
    Ok(Json(products))
}

async fn get_metal_rates(State(state): State<Arc<AppState>>) -> Result<Json<Vec<MetalRate>>, StatusCode> {
    let rates = sqlx::query_as::<_, MetalRate>(
        "SELECT id, metal_type, CAST(rate_per_gram AS FLOAT) as rate_per_gram, date 
         FROM metal_rates WHERE date = CURRENT_DATE ORDER BY metal_type"
    )
    .fetch_all(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    
    info!("Metal rates requested - found {} rates", rates.len());
    Ok(Json(rates))
}

// New customer handlers
async fn get_customers(
    State(state): State<Arc<AppState>>,
    Query(params): Query<CustomerSearch>,
) -> Result<Json<Vec<Customer>>, StatusCode> {
    let search = params.search.unwrap_or_default();
    
    let customers = if search.is_empty() {
        sqlx::query_as::<_, Customer>(
            "SELECT id, name, phone, email, customer_type, kyc_verified, 
             CAST(total_purchases AS FLOAT) as total_purchases, created_at
             FROM customers WHERE status != 'deleted' 
             ORDER BY created_at DESC LIMIT 20"
        )
        .fetch_all(&state.db)
        .await
    } else {
        let search_pattern = format!("%{}%", search);
        sqlx::query_as::<_, Customer>(
            "SELECT id, name, phone, email, customer_type, kyc_verified, 
             CAST(total_purchases AS FLOAT) as total_purchases, created_at
             FROM customers 
             WHERE status != 'deleted' AND (name ILIKE $1 OR phone ILIKE $1 OR email ILIKE $1)
             ORDER BY created_at DESC LIMIT 20"
        )
        .bind(search_pattern)
        .fetch_all(&state.db)
        .await
    };
    
    let customers = customers.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    info!("Customers requested - found {} customers", customers.len());
    Ok(Json(customers))
}

async fn get_customer(
    State(state): State<Arc<AppState>>,
    Path(id): Path<i32>,
) -> Result<Json<Customer>, StatusCode> {
    let customer = sqlx::query_as::<_, Customer>(
        "SELECT id, name, phone, email, customer_type, kyc_verified, 
         CAST(total_purchases AS FLOAT) as total_purchases, created_at
         FROM customers WHERE id = $1 AND status != 'deleted'"
    )
    .bind(id)
    .fetch_one(&state.db)
    .await
    .map_err(|_| StatusCode::NOT_FOUND)?;
    
    info!("Customer {} requested", id);
    Ok(Json(customer))
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();
    dotenv::dotenv().ok();
    
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgresql://elite_user@localhost/elite_db".to_string());
    
    let pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(&database_url)
        .await?;
    
    info!("Connected to database successfully");
    
    let state = Arc::new(AppState { db: pool });
    
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers([header::CONTENT_TYPE, header::AUTHORIZATION]);
    
    let app = Router::new()
        .route("/api/health", get(health_check))
        .route("/api/products", get(get_products))
        .route("/api/rates", get(get_metal_rates))
        .route("/api/customers", get(get_customers))
        .route("/api/customers/:id", get(get_customer))
        .with_state(state)
        .layer(cors);
    
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001").await?;
    
    info!("🏪 Masi Jewellers Backend running on http://0.0.0.0:3001");
    info!("📋 Customer Management APIs available");
    axum::serve(listener, app).await?;
    Ok(())
}
