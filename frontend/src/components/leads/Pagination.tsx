import { PaginationMeta } from "../../types";
import { Button } from "../ui/Button";

export const Pagination = ({ meta, onPageChange }: { meta: PaginationMeta; onPageChange(page: number): void }): JSX.Element => (
  <div className="flex animate-fade-up flex-col items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 transition duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:flex-row">
    <p className="text-sm text-slate-600 dark:text-slate-300">
      Showing page <span className="font-semibold">{meta.page}</span> of <span className="font-semibold">{meta.totalPages}</span> for{" "}
      <span className="font-semibold">{meta.total}</span> leads
    </p>
    <div className="flex gap-2">
      <Button variant="secondary" disabled={!meta.hasPreviousPage} onClick={() => onPageChange(meta.page - 1)}>
        Previous
      </Button>
      <Button variant="secondary" disabled={!meta.hasNextPage} onClick={() => onPageChange(meta.page + 1)}>
        Next
      </Button>
    </div>
  </div>
);
