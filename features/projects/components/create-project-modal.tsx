"use client";

import { ResponsiveModal } from "@/components/responsive-modal";

import { CreateProjectForm } from "@/features/projects/components/create-project-form";
import { UseCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";

export const CreateProjectModal = () => {
  const { isOpen, setIsOpen, close } = UseCreateProjectModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancelForm={close} />
    </ResponsiveModal>
  );
};
