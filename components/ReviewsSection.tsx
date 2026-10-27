"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useReviews } from "@/contexts/ReviewsContext";
import { computeAverage } from "@/lib/reviews";
import { ReviewForm } from "@/components/ReviewForm";
import { Button } from "@/components/ui/button";

export function ReviewsSection({ productId }: { productId: number }) {
  const { user, loading } = useAuth();
  const { reviews, myReview, deleteReview } = useReviews();
  const [editing, setEditing] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const average = computeAverage(reviews);

  const handleDelete = async () => {
    setDeleteError(null);
    setJustSubmitted(false);
    const result = await deleteReview();
    if (result.error) setDeleteError(result.error);
  };

  return (
    <section className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <h2 className="text-xl font-extrabold text-slate-900 mb-4">Customer Reviews</h2>

      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-yellow-500" aria-hidden="true">★</span>
        <span data-testid="rating-average" className="text-3xl font-extrabold text-slate-900">
          {average}
        </span>
        <span className="text-sm text-slate-500">
          (<span data-testid="review-count">{reviews.length}</span> reviews)
        </span>
      </div>

      {reviews.length === 0 ? (
        <p data-testid="reviews-empty" className="text-slate-500 text-sm mb-6">
          No reviews yet. Be the first to review this product!
        </p>
      ) : (
        <ul className="flex flex-col gap-4 mb-6">
          {reviews.map((review) => {
            const isMine = !!user && review.user_id === user.id;
            return (
              <li
                key={review.id}
                data-testid="review-item"
                className="border border-slate-100 rounded-xl p-4"
              >
                {isMine && editing ? (
                  <ReviewForm
                    productId={productId}
                    mode="edit"
                    defaultRating={review.rating}
                    defaultComment={review.comment}
                    onSuccess={() => setEditing(false)}
                    onCancel={() => setEditing(false)}
                  />
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <span data-testid="review-author" className="font-semibold text-slate-800">
                        {review.author}
                      </span>
                      <span className="text-sm text-slate-500">
                        <span className="text-yellow-500" aria-hidden="true">★ </span>
                        <span data-testid="review-rating">{review.rating}</span>
                      </span>
                    </div>
                    <p data-testid="review-comment" className="mt-2 text-slate-600 text-sm">
                      {review.comment}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{review.created_at.slice(0, 10)}</p>
                    {isMine && (
                      <div className="mt-3 flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          data-testid="btn-edit-review"
                          onClick={() => setEditing(true)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          data-testid="btn-delete-review"
                          onClick={handleDelete}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {deleteError && (
        <p data-testid="error-review" role="alert" className="text-sm text-red-600 mb-4">
          {deleteError}
        </p>
      )}

      {justSubmitted && myReview && (
        <p data-testid="review-success" className="text-sm text-emerald-600 mb-4">
          Thanks! Your review has been posted.
        </p>
      )}

      {!loading && !user && (
        <Link
          href="/login"
          data-testid="link-login-to-review"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Log in to write a review
        </Link>
      )}

      {!loading && user && !myReview && (
        <ReviewForm productId={productId} onSuccess={() => setJustSubmitted(true)} />
      )}
    </section>
  );
}
