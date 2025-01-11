import request from "../core/request";
import { Web } from "../core/Url";
import type { Category } from "../models/response/Category/Category";

export class CategoryService {
  public static async getAllCategory(): Promise<Category[]> {
    return request<Category[]>({
      url: Web.getAllCategory,
      method: 'GET',
      body: null,
      dataType: 'json'
    })
  }
}