import { useEffect, useState } from "react";
import { Box, Button, VStack, Input } from "@chakra-ui/react";

import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "../../../components/chakra/Dialog/Dialog";
import Alert, { AlertStatus } from "../../../components/ui/Alert/Alert";
import { Field } from "../../../components/chakra/Field/Field";
import { API_STAFFS_UPDATE } from "../../../constants/api";

type FormState = "ready" | "loading" | "done";

type Props = {
  staffData: any;
  isOpen: boolean;
  onClose?: () => any;
  onSuccess?: () => any;
};

export default function UpdateStaffModal(props: Props) {
  const { isOpen, onClose, onSuccess, staffData } = props;

  // Form state
  const [formState, setFormState] = useState<FormState>("ready");
  const [name, setName] = useState("");

  // Alert state
  const [alertStatus, setAlertStatus] = useState<AlertStatus>();
  const [alertTitle, setAlertTitle] = useState<string | undefined>();
  const [alertContent, setAlertContent] = useState<any>();

  // ------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------

  const resetForm = () => {
    // Reset form
    setFormState("ready");
    setAlertStatus(undefined);
    // Reset states
    if (staffData) {
      setName(staffData.Name);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
      resetForm();
    }
  };

  const handleSubmit = async () => {
    if (formState !== "ready") {
      return;
    }
    try {
      // Mark loading
      setFormState("loading");
      setAlertStatus("info");
      setAlertTitle("Updating staff ...");
      setAlertContent(null);
      // Send request
      const res = await fetch(API_STAFFS_UPDATE, {
        method: "POST",
        body: JSON.stringify({
          staffID: staffData.StaffID,
          name,
        }),
      });
      const decodedRes = await res.json();
      if (decodedRes.errors) {
        throw decodedRes.errors;
      } else {
        setFormState("done");
        setAlertStatus("success");
        setAlertTitle("Successfully updated the staff");
        setAlertContent(null);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      const errContent = Array.isArray(err) ? err : (err as any).message;
      setFormState("ready");
      setAlertStatus("error");
      setAlertTitle("Failed updating staff");
      setAlertContent(errContent);
    }
  };

  const handleChangeDescription = (e: any) => {
    if (formState === "ready") {
      setName(e.target.value);
    }
  };

  // ------------------------------------------------------------
  // Effects
  // ------------------------------------------------------------

  useEffect(() => {
    resetForm();
  }, [isOpen]);

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------

  if (!staffData) {
    return null;
  }

  return (
    <DialogRoot size="lg" open={isOpen}>
      <DialogContent>
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Update keychain</DialogTitle>
        </DialogHeader>

        {/* Body */}
        <DialogBody>
          {alertStatus && (
            <Box mb={4}>
              <Alert
                status={alertStatus}
                title={alertTitle}
                content={alertContent}
              />
            </Box>
          )}
          {/* Form */}
          <VStack alignItems="stretch">
            <VStack alignItems="stretch" gap={4}>
              <Field label="Staff ID" required>
                <Input disabled placeholder="" value={staffData.StaffID} />
              </Field>
            </VStack>
            <VStack alignItems="stretch" gap={4}>
              <Field label="Name" required>
                <Input
                  placeholder=""
                  value={name}
                  onChange={handleChangeDescription}
                />
              </Field>
            </VStack>
          </VStack>
        </DialogBody>

        {/* Footer */}
        <DialogFooter>
          {formState === "done" && <Button onClick={handleClose}>Close</Button>}
          {formState !== "done" && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={formState !== "ready"}>
                Update
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
