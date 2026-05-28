import { getProducts } from "@/services/products"
import CatalogoClient from "./CatalogoClient"

export const revalidate = 30

export default async function CatalogoPage() {
  const products = await getProducts()

  return <CatalogoClient products={products || []} />
}
