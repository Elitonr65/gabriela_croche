export type ProductImage = {
  id?: string
  url: string
  ordem?: number | null
}

export type ProductStatus = boolean | string | number | null

export type Product = {
  id: string
  nome: string
  descricao: string | null
  cores: string | null
  status?: ProductStatus
  imagens?: ProductImage[] | null
}

export type AdminProduct = Product & {
  status: ProductStatus
}

export type ProductFormData = {
  nome: string
  descricao: string
  cores: string
  status: boolean
}
