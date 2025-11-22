"use client";

import { Modal, Fade, Backdrop, Box } from "@mui/material";
import { RecipeFilters } from "@/components";
import useEscapeKey from "@/hooks/useEscapeKey";
import { RecipeFilter } from "@/types";
import { modalStyles, visuallyHidden } from "./Header.styles";

interface Props {
  open: boolean;
  onClose: () => void;
  options: RecipeFilter;
}

export const RecipeFiltersModal = ({ open, onClose, options }: Props) => {
  useEscapeKey(open, onClose);

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}  // ← Backdrop jako komponent tła (bez dzieci!)
      slotProps={{
        backdrop: { 
          timeout: 600,  // animacja tła
          sx: {  // styl tła (overlay)
            bgcolor: "rgba(0, 0, 0, 0.5)",
          },
        },
      }}
    >
      <Fade in={open} timeout={600}>
        <Box
          sx={modalStyles}
          role="dialog"
          aria-modal="true"
          aria-labelledby="filters-modal-title"
          tabIndex={-1}
        >
          <Box id="filters-modal-title" sx={visuallyHidden}>
            Filtry przepisów
          </Box>

          <RecipeFilters onFiltersChange={() => {}} onClose={onClose} options={options} />
        </Box>
      </Fade>
    </Modal>
  );
};