# Inventory Shop

Product & Inventory Management — Next.js 16, React 19, PostgreSQL, Prisma 7

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 |
| UI | React 19, Tailwind CSS |
| Database | PostgreSQL 18 |
| ORM | Prisma 7 |
| State | Zustand (cart) |

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/inventory-shop.git
cd inventory-shop
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

```bash
cp .env.example .env
```

### 4. Create database

**pgAdmin ашиглах:**
1. pgAdmin нээх
2. Зүүн талд `Servers → PostgreSQL` дээр right-click
3. `Create → Database` сонгох
4. Database нэрийг `inventory_db` гэж оруулах
5. `Save` дарах

**Терминалаар:**
```bash
psql -U postgres
CREATE DATABASE inventory_db;
\q
```

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Generate Prisma client

```bash
npx prisma generate
```

### 6. Run migrations

```bash
npx prisma migrate dev
```

### 7. Seed database

```bash
npx prisma db seed
```

### 8. Start development server

```bash
npm run dev
```

http://localhost:3000 дээр нээгдэнэ.

## Pages

| Route | Description |
|---|---|
| `/` | Бүтээгдэхүүний жагсаалт, хайлт, ангиллаар шүүх |
| `/products/new` | Шинээр бүтээгдэхүүн нэмэх |
| `/products/[id]` | Бүтээгдэхүүн засах - Бүтээгдэхүүн харах хуудсыг edit хуудсаар орлуулав |
| `/inventory` | Нөөцийн удирдлага |

## Architecture

Энэ апп **Server Actions** ашигладаг:

- Form submit, CRUD үйлдлүүд → Server Actions
- Захиалга → Prisma Transaction ашиглан атомик байдлаар хийгдэнэ

### Reusable Components

Кодын давхцлаас зайлсхийхийн тулд нийтлэг хэрэглэгдэх элементүүдийг component болгож тусд нь гаргасан.

**ProductForm** — бүтээгдэхүүн нэмэх болон засах хуудас хоёулаа нэг form component ашигладаг. `action` prop-оор `createProduct` эсвэл `updateProduct` server action дамжуулна. Ингэснээр form-ын логик, validation, UI нэг газарт төвлөрч, давхцал үүсэхгүй.

**DeleteButton** — ямар ч entity устгах үйлдэлд ашиглаж болох нийтлэг component. `onDelete` prop-оор дурын delete action дамжуулна. Товчны class, text зэргийг дурын хэлбэрээр өөрчлөх боломжтой.

### Cart
Cart буюу хэрэглэгчийн сагсыг header хэсэгт dropdown-оор шийдэж өгсөн ба үүнийг ecommerce системүүдэд түгээмэл ашигладаг. Тиймээс энэхүү app-д /cart route одоохондоо шаардлагагүй гэж үзсэн. 

Сагсыг **Zustand + localStorage**-д хадгалдаг

## Bonus Features
- Prisma transaction
- Debounce хайлт (300ms)
- Zod validation
- next/image