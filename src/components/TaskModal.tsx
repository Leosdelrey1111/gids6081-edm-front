import { useState, useEffect, type FormEvent } from "react";
import { Button, Checkbox } from "@heroui/react";
import { GenericModal } from "@/components/GenericModal";
import { Input } from "@/components/Input";
import { Alert } from "@/components/Alert";
import { validateLength } from "@utils/sanitize";
import type { Task, CreateTaskPayload } from "@services/task.service";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  userId: number;
  onSave: (payload: CreateTaskPayload) => Promise<void>;
}

export const TaskModal = ({
  isOpen,
  onOpenChange,
  task,
  userId,
  onSave,
}: Props) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    priority: false,
  });
  const [errors, setErrors] = useState<{ name?: string; description?: string }>(
    {},
  );
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (task)
        setForm({
          name: task.name,
          description: task.description,
          priority: task.priority,
        });
      else setForm({ name: "", description: "", priority: false });
      setErrors({});
      setApiError("");
    }
  }, [isOpen, task]);

  const set =
    (field: "name" | "description") =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const validate = () => {
    const errs: typeof errors = {};
    if (!validateLength(form.name, 150))
      errs.name = "Nombre requerido (máx 150 chars).";
    if (!validateLength(form.description, 200))
      errs.description = "Descripción requerida (máx 200 chars).";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await onSave({ ...form, user_id: userId });
      onOpenChange(false);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={task ? "Editar tarea" : "Nueva tarea"}
      body={
        <form
          id="task-form"
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          {apiError && <Alert message={apiError} />}
          <Input
            id="task-name"
            label="Nombre"
            value={form.name}
            onChange={set("name")}
            error={errors.name}
            maxLength={150}
            required
          />
          <Input
            id="task-desc"
            label="Descripción"
            value={form.description}
            onChange={set("description")}
            error={errors.description}
            maxLength={200}
            required
          />
          <Checkbox
            isSelected={form.priority}
            onValueChange={(v) => setForm((p) => ({ ...p, priority: v }))}
            color="success"
            classNames={{ label: "text-zinc-300 text-sm" }}
          >
            Alta prioridad
          </Checkbox>
        </form>
      }
      footer={
        <>
          <Button
            variant="flat"
            className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            onPress={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="task-form"
            isLoading={loading}
            className="bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold shadow-lg shadow-emerald-900/30"
          >
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </>
      }
    />
  );
};
