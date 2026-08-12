"use client";

import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/api/categories";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import TableSkeleton from "@/components/shared/TableSkeleton";
import Dialog from "@/components/ui/Dialog";
import { Category, fetchCategories } from "@/lib/api/tours";
import { inputClass, labelClass, textareaClass } from "@/lib/constants/formStyles";
import { useQueryToastError } from "@/hooks/useQueryToastError";
import { getApiErrorMessage } from "@/lib/utils/apiError";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FolderTree, Pencil, Plus, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

type CategoryFormState = {
  name: string;
  description: string;
};

const emptyForm: CategoryFormState = { name: "", description: "" };

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  useQueryToastError(
    categoriesQuery.isError,
    categoriesQuery.error,
    "Failed to load categories."
  );

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
      };
      if (editing) {
        return updateCategory(editing.id, payload);
      }
      return createCategory(payload);
    },
    onSuccess: () => {
      toast.success(editing ? "Category updated" : "Category created");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      closeModal();
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to save category."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to delete category."));
    },
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setForm({
      name: category.name,
      description: category.description ?? "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    saveMutation.mutate();
  };

  const handleDelete = (category: Category) => {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    deleteMutation.mutate(category.id);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Categories
          </h1>
          <p className="mt-1 text-sm text-slate-400">Manage tour categories.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 text-sm font-semibold text-white transition hover:bg-emerald-400 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Create
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/10">
        {categoriesQuery.isLoading ? (
          <TableSkeleton rows={4} />
        ) : categoriesQuery.isError ? (
          <div className="p-6">
            <ErrorState
              message="Failed to load categories."
              onRetry={() => categoriesQuery.refetch()}
            />
          </div>
        ) : categoriesQuery.data?.length === 0 ? (
          <EmptyState
            icon={FolderTree}
            title="No categories yet"
            description="Create your first category to organize tour packages."
            actionLabel="Create category"
            onAction={openCreate}
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-800 bg-slate-800/50 text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Slug</th>
                    <th className="hidden px-4 py-3 font-medium lg:table-cell">
                      Description
                    </th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categoriesQuery.data?.map((category) => (
                    <tr
                      key={category.id}
                      className="border-b border-slate-800/50 last:border-0"
                    >
                      <td className="px-4 py-3 font-medium text-white">
                        {category.name}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {category.slug}
                      </td>
                      <td className="hidden px-4 py-3 text-slate-400 lg:table-cell">
                        {category.description || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(category)}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(category)}
                            className="inline-flex items-center gap-1 rounded-full border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 p-4 md:hidden">
              {categoriesQuery.data?.map((category) => (
                <div
                  key={category.id}
                  className="rounded-2xl border border-slate-800 bg-slate-800/50 p-4"
                >
                  <p className="font-bold text-white">{category.name}</p>
                  <p className="text-xs text-slate-500">{category.slug}</p>
                  {category.description && (
                    <p className="mt-2 text-sm text-slate-400">
                      {category.description}
                    </p>
                  )}
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(category)}
                      className="flex min-h-10 flex-1 items-center justify-center gap-1 rounded-full border border-slate-700 text-xs font-medium text-slate-300"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(category)}
                      className="flex min-h-10 flex-1 items-center justify-center gap-1 rounded-full border border-red-500/30 text-xs font-medium text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Dialog
        open={modalOpen}
        onClose={closeModal}
        title={editing ? "Edit Category" : "Create Category"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className={textareaClass}
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={closeModal}
              className="min-h-11 flex-1 rounded-full border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="min-h-11 flex-1 rounded-full bg-emerald-500 text-sm font-semibold text-white hover:bg-emerald-400 disabled:opacity-60"
            >
              {saveMutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
