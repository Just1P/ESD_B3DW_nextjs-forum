import { apiClient } from "@/lib/api-client";
import type { Tag } from "@/generated/prisma";

async function fetchTags() {
  return apiClient.get<Tag[]>("/tags");
}

const TagService = {
  fetchTags,
};

export default TagService;


