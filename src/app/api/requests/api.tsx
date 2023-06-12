import { Item } from "@/app/types/Item";
import { List } from "@/app/types/List";
import axios from "axios";

export const getLists = async () =>
  axios.get<List[]>("/list").then(({ data }) => data);

export const createList = async (data: List) => {
  try {
    await axios.post("/todos", { data });
  } catch (e) {
    throw e;
  }
};

export const updateItem = async (data: Item) => {
  try {
    await axios.put(`/todos/${data.id}`, { data });
  } catch (e) {
    throw e;
  }
}
