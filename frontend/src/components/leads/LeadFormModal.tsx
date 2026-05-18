import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { LeadFormValues, leadSchema } from "../../schemas/leadSchema";
import { Lead, LeadSource, LeadStatus } from "../../types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

interface Props {
  lead?: Lead | null;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose(): void;
  onSubmit(values: LeadFormValues): Promise<void>;
}

const defaultValues: LeadFormValues = {
  name: "",
  email: "",
  status: LeadStatus.New,
  source: LeadSource.Website
};

export const LeadFormModal = ({ lead, isOpen, isSubmitting, onClose, onSubmit }: Props): JSX.Element | null => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues
  });

  useEffect(() => {
    reset(
      lead
        ? { name: lead.name, email: lead.email, status: lead.status, source: lead.source }
        : defaultValues
    );
  }, [lead, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg animate-scale-in rounded-lg bg-white shadow-soft dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-lg font-bold text-ink dark:text-white">{lead ? "Update lead" : "Create lead"}</h2>
          <button className="rounded-lg p-2 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" onClick={onClose} aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form className="space-y-4 p-5" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Name" error={errors.name?.message} {...register("name")} />
          <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
          <Select label="Status" error={errors.status?.message} {...register("status")}>
            {Object.values(LeadStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
          <Select label="Source" error={errors.source?.message} {...register("source")}>
            {Object.values(LeadSource).map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </Select>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save lead"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
