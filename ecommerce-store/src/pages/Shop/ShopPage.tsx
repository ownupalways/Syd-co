import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useTheme } from '@context/useTheme'
import { theme } from '@styles/theme'
import { getProductsApi } from '@api/products'
import ProductCard from '@components/ProductCard'

const categories = ['All', 'Electronics', 'Fashion', 'Footwear', 'Sports', 'Home & Living']

const ShopPage: React.FC = () => {
  const { isDark } = useTheme()
  const t = isDark ? theme.dark : theme.light
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['products', { search, category, page }],
    queryFn: () => getProductsApi({
      search: search || undefined,
      category: category || undefined,
      page,
      limit: 12,
    }),
  })

  const products = Array.isArray(data?.data?.data) ? data.data.data : []
const pagination = data?.data?.pagination

  return (
		<div
			style={{
				background: t.background,
				minHeight: "100vh",
				padding: "32px 24px",
			}}>
			<div
				style={{
					maxWidth: "1100px",
					margin: "0 auto",
				}}>
				<h1
					style={{
						color: t.text,
						marginBottom: "24px",
					}}>
					Shop
				</h1>

				{/* Filters */}
				<div
					style={{
						display: "flex",
						gap: "16px",
						flexWrap: "wrap",
						marginBottom: "32px",
					}}>
					{/* Search */}
					<div
						style={{
							position: "relative",
							flex: 1,
							minWidth: "200px",
						}}>
						<Search
							size={18}
							style={{
								position: "absolute",
								left: "12px",
								top: "50%",
								transform: "translateY(-50%)",
								color: t.textSecondary,
							}}
						/>
						<input
							type="text"
							placeholder="Search products..."
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setPage(1);
							}}
							style={{
								width: "100%",
								padding: "10px 10px 10px 40px",
								borderRadius: "10px",
								border: `1px solid ${t.border}`,
								background: t.backgroundSecondary,
								color: t.text,
								fontSize: "15px",
								outline: "none",
							}}
						/>
					</div>

					{/* Category Filter */}
					<div
						style={{
							display: "flex",
							gap: "8px",
							flexWrap: "wrap",
							alignItems: "center",
						}}>
						<SlidersHorizontal
							size={18}
							color={t.textSecondary}
						/>
						{categories.map((cat) => (
							<button
								key={cat}
								onClick={() => {
									setCategory(
										cat === "All" ? "" : cat,
									);
									setPage(1);
								}}
								style={{
									padding: "8px 16px",
									borderRadius: "20px",
									border: `1px solid ${t.border}`,
									cursor: "pointer",
									fontSize: "13px",
									fontWeight: 600,
									background:
										category === cat ||
										(cat === "All" && !category)
											? t.primaryDark
											: t.backgroundSecondary,
									color:
										category === cat ||
										(cat === "All" && !category)
											? "#fff"
											: t.text,
									transition: "all 0.2s",
								}}>
								{cat}
							</button>
						))}
					</div>
				</div>

				{/* Products Grid */}
				{isLoading ? (
					<div
						style={{
							textAlign: "center",
							padding: "60px",
							color: t.textSecondary,
						}}>
						Loading products...
					</div>
				) : products.length === 0 ? (
					<div
						style={{
							textAlign: "center",
							padding: "60px",
							color: t.textSecondary,
						}}>
						No products found.
					</div>
				) : (
					<div
						style={{
							display: "grid",
							gridTemplateColumns:
								"repeat(auto-fill, minmax(160px, 1fr))",
							gap: "12px",
						}}>
						{products.map((product) => (
							<ProductCard
								key={product._id}
								product={product}
							/>
						))}
					</div>
				)}

				{/* Pagination */}
				{pagination && pagination.pages > 1 && (
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							gap: "8px",
							marginTop: "40px",
						}}>
						{Array.from(
							{ length: pagination.pages },
							(_, i) => i + 1,
						).map((p) => (
							<button
								key={p}
								onClick={() => setPage(p)}
								style={{
									padding: "8px 16px",
									borderRadius: "8px",
									border: `1px solid ${t.border}`,
									background:
										page === p
											? t.primaryDark
											: t.backgroundSecondary,
									color:
										page === p ? "#fff" : t.text,
									cursor: "pointer",
									fontWeight: 600,
								}}>
								{p}
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default ShopPage
