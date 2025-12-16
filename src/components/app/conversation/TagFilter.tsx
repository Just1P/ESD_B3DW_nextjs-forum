"use client";

import TagService from "@/services/tag.service";
import type { Tag } from "@/generated/prisma";
import { useQuery } from "@tanstack/react-query";

interface TagFilterProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagFilter({ selectedTags, onChange }: TagFilterProps) {
  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      return await TagService.fetchTags();
    },
  });

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onChange(selectedTags.filter((t) => t !== tagName));
    } else {
      onChange([...selectedTags, tagName]);
    }
  };

  if (!tags.length) return null;

  return (
    <div className="mb-3 px-4">
      <div className="flex flex-wrap gap-2 items-center text-xs">
        <span className="text-gray-500">Filtrer par tags :</span>
        {(tags as Tag[]).map((tag) => {
          const isActive = selectedTags.includes(tag.name);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.name)}
              className={`px-2 py-1 rounded-full border text-xs font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              #{tag.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}


