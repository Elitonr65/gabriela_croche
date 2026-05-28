import type { ProductStatus } from "@/types/product"

const ACTIVE_STATUS_VALUES = new Set(["true", "t", "1", "ativo", "active", "sim", "yes"])

export function isProductActive(status: ProductStatus) {
  if (status === true || status === 1) {
    return true
  }

  if (typeof status === "string") {
    return ACTIVE_STATUS_VALUES.has(status.trim().toLowerCase())
  }

  return false
}

export function toWritableProductStatus(currentStatus: ProductStatus, nextStatus: boolean) {
  if (typeof currentStatus === "string") {
    return nextStatus ? "true" : "false"
  }

  if (typeof currentStatus === "number") {
    return nextStatus ? 1 : 0
  }

  return nextStatus
}
