import { useState } from "react";
import { Box, Button } from "@chakra-ui/react";

import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "../../../components/chakra/Dialog/Dialog";
import Alert, { AlertStatus } from "../../../components/ui/Alert/Alert";
import { API_STAFFS_DELETE } from "../../../constants/api";
import { ROUTE_STAFFS_LIST } from "../../../constants/routes";

type FormState = "ready" | "loading" | "done";

type Props = {
  staffData: any;
  isOpen: boolean;
  onClose?: () => any;
};

export default function DeleteStaffModal(props: Props) {
  const { isOpen, onClose, staffData } = props;

  // Form state
  const [formState, setFormState] = useState<FormState>("ready");

  // Alert state
  const [alertStatus, setAlertStatus] = useState<AlertStatus>();
  const [alertTitle, setAlertTitle] = useState<string | undefined>();
  const [alertContent, setAlertContent] = useState<any>();

  // ------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleClickReturnToHome = () => {
    document.location.href = ROUTE_STAFFS_LIST;
  };

  const handleSubmit = async () => {
    if (formState !== "ready") {
      return;
    }
    try {
      // Mark loading
      setFormState("loading");
      setAlertStatus("info");
      setAlertTitle("Deleting staff ...");
      setAlertContent(null);
      // Send request
      const res = await fetch(API_STAFFS_DELETE, {
        method: "POST",
        body: JSON.stringify({
          staffID: staffData.StaffID,
        }),
      });
      const decodedRes = await res.json();
      if (decodedRes.errors) {
        throw decodedRes.errors;
      } else {
        setFormState("done");
        setAlertStatus("success");
        setAlertTitle("Successfully deleted staff");
        setAlertContent(null);
      }
    } catch (err) {
      const errContent = Array.isArray(err) ? err : (err as any).message;
      setFormState("ready");
      setAlertStatus("error");
      setAlertTitle("Failed deleting the staff");
      setAlertContent(errContent);
    }
  };

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
          <DialogTitle>Delete staff</DialogTitle>
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
          <p>
            Are you sure you want to delete staff "{staffData.StaffID}" (
            {staffData.Name}) and disassociate all their keys?
          </p>
        </DialogBody>

        {/* Footer */}
        <DialogFooter>
          {formState === "done" && (
            <Button onClick={handleClickReturnToHome}>
              Return to staffs list
            </Button>
          )}
          {formState !== "done" && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                colorPalette="red"
                onClick={handleSubmit}
                disabled={formState !== "ready"}
              >
                Delete
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
