import React from "react";
import { BsFillKeyFill } from "react-icons/bs";
import { Card, VStack, Box, Button, Text, HStack } from "@chakra-ui/react";

type Props = {
  keyCopyData: any;
};

export default function KeyCopyCard(props: Props) {
  const { keyCopyData } = props;
  const { KeyID, DateCreated, StaffID, StaffName } = keyCopyData;
  const hasAssignedStaff = StaffID.Valid;

  return (
    <Card.Root width={"full"}>
      <Box p={4}>
        <HStack alignItems="start">
          <div>
            <BsFillKeyFill size={48} />
          </div>
          <VStack gap={1} alignItems="stretch" flexGrow={1}>
            <div>
              <Text textStyle="lg" style={{ width: "100%", fontWeight: 600 }}>
                {KeyID}
              </Text>
              <div style={{ color: "#334155" }}>Created at {DateCreated}</div>
            </div>

            <div
              style={{
                color: "#64748b",
                backgroundColor: "#f1f5f9",
                borderRadius: 4,
                paddingInline: 8,
                paddingBlock: 4,
              }}
            >
              {hasAssignedStaff ? (
                <>
                  {StaffID.Valid && StaffID.String} (
                  {StaffName.Valid && StaffName.String})
                </>
              ) : (
                <i
                  style={{
                    fontStyle: "italic",
                    color: "#cbd5e1",
                  }}
                >
                  Unassigned
                </i>
              )}
            </div>
          </VStack>
        </HStack>
      </Box>
    </Card.Root>
  );
}
