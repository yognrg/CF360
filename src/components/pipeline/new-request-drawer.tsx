"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { sendJSON } from "@/lib/client";
import type { Priority } from "@/lib/types";
import type { RequestRow } from "@/lib/dto";

interface FormValues {
  product: string;
  category: string;
  landing_url: string;
  format_name: string;
  priority: Priority;
}

export function NewRequestDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { priority: "medium", format_name: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const row = await sendJSON<RequestRow>("/api/requests", "POST", {
        ...values,
        format_name: values.format_name || null,
      });
      toast({
        variant: "success",
        title: "Request raised",
        description: `${row.cf_id} · ${row.product} added to the pipeline.`,
      });
      reset();
      onClose();
      router.refresh();
    } catch (e) {
      toast({
        variant: "error",
        title: "Could not raise request",
        description: e instanceof Error ? e.message : undefined,
      });
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="New Video Brief"
      subtitle="Create a single video from one product brief."
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button onClick={onSubmit} loading={submitting}>
            Raise Request
          </Button>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          label="Product"
          placeholder="e.g. Gold Loan"
          error={errors.product?.message}
          {...register("product", { required: "Product is required" })}
        />
        <Input
          label="Category"
          placeholder="e.g. Secured Loans"
          error={errors.category?.message}
          {...register("category", { required: "Category is required" })}
        />
        <Input
          label="Landing Page URL"
          placeholder="bajajfinserv.in/…"
          error={errors.landing_url?.message}
          {...register("landing_url", { required: "Landing page URL is required" })}
        />
        <Input
          label="Format (optional)"
          placeholder="e.g. Offer Reel"
          {...register("format_name")}
        />
        <div>
          <label className="mb-1 block text-label text-text">Priority</label>
          <select
            className="h-control w-full rounded-control border border-border bg-surface px-3 text-body text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register("priority")}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </form>
    </Drawer>
  );
}
