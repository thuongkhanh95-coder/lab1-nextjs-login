"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, type ReviewInput } from "@/lib/reviewSchema";
import { useReviews } from "@/contexts/ReviewsContext";
import { Button } from "@/components/ui/button";

interface ReviewFormProps {
  productId: number;
  mode?: "create" | "edit";
  defaultRating?: number;
  defaultComment?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({
  productId,
  mode = "create",
  defaultRating,
  defaultComment = "",
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const { submitReview, updateReview } = useReviews();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { product_id: productId, rating: defaultRating, comment: defaultComment },
  });

  const onSubmit = async (values: ReviewInput) => {
    setServerError(null);
    const result =
      mode === "edit"
        ? await updateReview(values.rating, values.comment)
        : await submitReview(values.rating, values.comment);

    if (result.error) {
      setServerError(result.error);
      return;
    }
    onSuccess?.();
  };

  return (
    <form
      data-testid="review-form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="review-rating" className="text-sm font-semibold text-slate-700">
          Rating
        </label>
        <select
          id="review-rating"
          data-testid="input-rating"
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm"
          {...register("rating", {
            setValueAs: (v) => (v === "" || v == null ? undefined : Number(v)),
          })}
        >
          <option value="">Select a rating</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        {errors.rating && (
          <p data-testid="error-rating" className="text-sm text-red-600">
            {errors.rating.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="review-comment" className="text-sm font-semibold text-slate-700">
          Comment
        </label>
        <textarea
          id="review-comment"
          data-testid="input-comment"
          rows={4}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          {...register("comment")}
        />
        {errors.comment && (
          <p data-testid="error-comment" className="text-sm text-red-600">
            {errors.comment.message}
          </p>
        )}
      </div>

      {serverError && (
        <p data-testid="error-review" role="alert" className="text-sm text-red-600">
          {serverError}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" data-testid="btn-submit-review" disabled={isSubmitting}>
          {mode === "edit" ? "Save changes" : "Submit review"}
        </Button>
        {mode === "edit" && onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
