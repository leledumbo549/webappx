# Backend Architecture Overview

This document summarizes the current server side data model and authentication logic.

## Database Schema

The SQLite database is created in memory using `drizzle-orm`. The main tables are:

- **users** – stores user credentials and roles (`admin`, `buyer`, `seller`).
- **sellers** – profile information for seller accounts.
- **products** – items offered by sellers.
- **orders** – purchase records for buyers.
- **sellerPayouts** – payouts issued to sellers.
- **reports** – user reports handled by admins.
- **settings** – key/value application settings.

There are no tables related to wallets, balances or ledgers beyond the `orders` and `sellerPayouts` records.

## Authentication

Tokens are simple Base64 encodings of the user ID generated in `generateToken`. Validation occurs via `validateToken` which looks up the corresponding user. No additional balance or wallet logic is present.

