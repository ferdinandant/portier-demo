import { useState } from "react";
import { Box, Button, VStack, Input } from "@chakra-ui/react";
import { Link } from "react-router";

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
import { API_STAFFS_CREATE } from "../../../constants/api";
import substituteURL from "../../../utils/url/substituteURL";
import { ROUTE_STAFFS_VIEW } from "../../../constants/routes";

type FormState = "ready" | "loading" | "done";

type Props = {
  isOpen: boolean;
  onClose?: () => any;
  onSuccess?: () => any;
};

export default function CreateStaffModal(props: Props) {
  const { isOpen, onClose, onSuccess } = props;

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
    setName("");
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
      resetForm();
    }
  };

  const handleChangeName = (e: any) => {
    if (formState === "ready") {
      setName(e.target.value);
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
      setAlertTitle("Creating a new staff ...");
      setAlertContent(null);
      // Send request
      const res = await fetch(API_STAFFS_CREATE, {
        method: "POST",
        body: JSON.stringify({
          name,
        }),
      });
      const decodedRes = await res.json();
      if (decodedRes.errors) {
        throw decodedRes.errors;
      } else {
        const staffID = decodedRes.data.StaffID;
        const href = substituteURL(ROUTE_STAFFS_VIEW, { staffID });
        setFormState("done");
        setAlertStatus("success");
        setAlertTitle("Successfully created a new staff");
        setAlertContent(
          <p>
            You can see the newly created staff{" "}
            <Link to={href} style={{ textDecoration: "underline" }}>
              here
            </Link>
            .
          </p>
        );
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      const errContent = Array.isArray(err) ? err : (err as any).message;
      setFormState("ready");
      setAlertStatus("error");
      setAlertTitle("Failed creating a new staff");
      setAlertContent(errContent);
    }
  };

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------

  return (
    <DialogRoot size="lg" open={isOpen}>
      <DialogContent>
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Create new keychain</DialogTitle>
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
          <VStack alignItems="stretch" gap={4}>
            <Field label="Name" required>
              <Input placeholder="" value={name} onChange={handleChangeName} />
            </Field>
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
                Create
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
