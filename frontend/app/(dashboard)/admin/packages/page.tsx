"use client";

import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import TableSkeleton from "@/components/shared/TableSkeleton";
import Dialog from "@/components/ui/Dialog";
import {
  Category,
  createTourPackage,
  deleteTourPackage,
  fetchCategories,
  fetchTourPackages,
  TourPackage,
  updateTourPackage,
} from "@/lib/api/tours";
import {
  inputClass,
  labelClass,
  selectClass,
  textareaClass,
} from "@/lib/constants/formStyles";
import { useQueryToastError } from "@/hooks/useQueryToastError";
import { getApiErrorMessage } from "@/lib/utils/apiError";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Package, Pencil, Plus, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

type PackageFormState = {
  title: string;
  description: string;
  location: string;
  price: string;
  duration: string;
  maxGroupSize: string;
  categoryId: string;
  imagesText: string;
};

const emptyForm: PackageFormState = {
  title: "",
  description: "",
  location: "",
  price: "",
  duration: "",
  maxGroupSize: "",
  categoryId: "",
  imagesText: "",
};

function parseImages(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function toForm(pkg: TourPackage): PackageFormState {
  return {
    title: pkg.title,
    description: pkg.description,
    location: pkg.location,
    price: String(pkg.price),
    duration: String(pkg.duration),
    maxGroupSize: String(pkg.maxGroupSize),
    categoryId: pkg.categoryId,
    imagesText: pkg.images.join("\n"),
  };
}

export default function AdminPackagesPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TourPackage | null>(null);
  const [form, setForm] = useState<PackageFormState>(emptyForm);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const packagesQuery = useQuery({
    queryKey: ["tour-packages", "admin"],
    queryFn: () => fetchTourPackages({ limit: 100 }),
  });

  useQueryToastError(
    packagesQuery.isError,
    packagesQuery.error,
    "Failed to load packages."
  );

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        price: Number(form.price),
        duration: Number(form.duration),
        maxGroupSize: Number(form.maxGroupSize),
        categoryId: form.categoryId,
        images: parseImages(form.imagesText),
      };
      if (editing) {
        return updateTourPackage(editing.id, payload);
      }
      return createTourPackage(payload);
    },
    onSuccess: () => {
      toast.success(editing ? "Package updated" : "Package created");
      queryClient.invalidateQueries({ queryKey: ["tour-packages"] });
      closeModal();
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to save package."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTourPackage,
    onSuccess: () => {
      toast.success("Package deleted");
      queryClient.invalidateQueries({ queryKey: ["tour-packages"] });
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to delete package."));
    },
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (pkg: TourPackage) => {
    setEditing(pkg);
    setForm(toForm(pkg));
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

  const handleDelete = (pkg: TourPackage) => {
    if (!window.confirm(`Delete package "${pkg.title}"?`)) return;
    deleteMutation.mutate(pkg.id);
  };

  const categories = categoriesQuery.data ?? [];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Tour Packages
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage all tour packages.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 text-sm font-semibold text-white transition hover:bg-emerald-400 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Create Package
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/10">
        {packagesQuery.isLoading ? (
          <TableSkeleton rows={5} />
        ) : packagesQuery.isError ? (
          <div className="p-6">
            <ErrorState
              message="Failed to load packages."
              onRetry={() => packagesQuery.refetch()}
            />
          </div>
        ) : packagesQuery.data?.data.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No packages yet"
            description="Create your first tour package to start accepting bookings."
            actionLabel="Create package"
            onAction={openCreate}
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-800 bg-slate-800/50 text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Package</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="hidden px-4 py-3 font-medium md:table-cell">
                      Duration
                    </th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packagesQuery.data?.data.map((pkg) => (
                    <tr
                      key={pkg.id}
                      className="border-b border-slate-800/50 last:border-0"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg">
                            <ImageWithFallback
                              src={pkg.images?.[0]}
                              categorySlug={pkg.category?.slug}
                              alt={pkg.title}
                              sizes="56px"
                              containerClassName="absolute inset-0"
                            />
                          </div>
                          <span className="font-medium text-white">
                            {pkg.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {pkg.location}
                      </td>
                      <td className="px-4 py-3 text-emerald-400">
                        BDT {pkg.price.toLocaleString()}
                      </td>
                      <td className="hidden px-4 py-3 text-slate-400 md:table-cell">
                        {pkg.duration} days
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {pkg.category?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(pkg)}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-700 p-2 text-slate-300 hover:bg-slate-800"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(pkg)}
                            className="inline-flex items-center gap-1 rounded-full border border-red-500/30 p-2 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 p-4 lg:hidden">
              {packagesQuery.data?.data.map((pkg) => (
                <div
                  key={pkg.id}
                  className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/50"
                >
                  <div className="relative h-40">
                    <ImageWithFallback
                      src={pkg.images?.[0]}
                      categorySlug={pkg.category?.slug}
                      alt={pkg.title}
                      sizes="100vw"
                      containerClassName="absolute inset-0"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-white">{pkg.title}</p>
                    <p className="text-sm text-slate-400">{pkg.location}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span className="text-emerald-400">
                        BDT {pkg.price.toLocaleString()}
                      </span>
                      <span>{pkg.duration} days</span>
                      <span>{pkg.category?.name}</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(pkg)}
                        className="flex min-h-10 flex-1 items-center justify-center gap-1 rounded-full border border-slate-700 text-xs font-medium text-slate-300"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(pkg)}
                        className="flex min-h-10 flex-1 items-center justify-center gap-1 rounded-full border border-red-500/30 text-xs font-medium text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
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
        title={editing ? "Edit Package" : "Create Package"}
        className="sm:max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select
              required
              value={form.categoryId}
              onChange={(e) =>
                setForm({ ...form, categoryId: e.target.value })
              }
              className={selectClass}
            >
              <option value="">Select category</option>
              {categories.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Price (BDT)</label>
            <input
              required
              type="number"
              min={1}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Duration (days)</label>
            <input
              required
              type="number"
              min={1}
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Max group size</label>
            <input
              required
              type="number"
              min={1}
              value={form.maxGroupSize}
              onChange={(e) =>
                setForm({ ...form, maxGroupSize: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className={textareaClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Image URLs (one per line)</label>
            <textarea
              rows={3}
              value={form.imagesText}
              onChange={(e) =>
                setForm({ ...form, imagesText: e.target.value })
              }
              placeholder="https://images.unsplash.com/..."
              className={textareaClass}
            />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row">
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
