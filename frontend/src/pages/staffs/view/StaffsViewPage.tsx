import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Input,
  Card,
  Spinner,
  VStack,
  Box,
  Button,
  Text,
  HStack,
} from "@chakra-ui/react";

// Components
import Header from "../../../components/site/Header/Header";
import Alert, { AlertStatus } from "../../../components/ui/Alert/Alert";
import Pagination from "../../../components/ui/Pagination/Pagination";
// import UpdateStaffModal from "./UpdateStaffModal";
// import DeleteStaffModal from "./DeleteStaffModal";

// Constants
import {
  API_KEYCOPIES_LIST_BY_STAFF,
  API_KEYCOPIES_UPDATE,
  API_STAFFS_VIEW,
} from "../../../constants/api";
import { ROUTE_STAFFS_VIEW } from "../../../constants/routes";

// Utils
import debounce from "../../../utils/timing/debounce";
import parseURL from "../../../utils/url/parseURL";
import KeyCopyCard from "./KeyCopyCard";

// ================================================================================
// MAIN
// ================================================================================

export default function KeychainsViewPage() {
  // Filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [debouncedFilterValue, setDebouncedFilterValue] = useState("");
  const debouncedSetDebouncedFilterValueRef = useRef(
    debounce(300, (value: string) => {
      setDebouncedFilterValue(value);
    })
  );

  // Alert state
  const [alertStatus, setAlertStatus] = useState<AlertStatus>();
  const [alertTitle, setAlertTitle] = useState<string | undefined>();
  const [alertContent, setAlertContent] = useState<any>();

  // Data state
  const [isStaffDataLoading, setIsStaffDataLoading] = useState(true);
  const [isKeyCopiesDataLoading, setIsKeyCopiesDataLoading] = useState(true);
  const [staffData, setStaffData] = useState<any>();
  const [keyCopiesData, setKeyCopiesData] = useState<any>();

  // Modal state
  const [isUpdateStaffModalOpen, setIsUpdateStaffModalOpen] = useState(false);
  const [isDeleteStaffModalOpen, setIsDeleteStaffModalOpen] = useState(false);

  // ------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------

  const fetchStaffData = async () => {
    try {
      const { staffID } = parseURL(ROUTE_STAFFS_VIEW);
      const res = await fetch(API_STAFFS_VIEW, {
        method: "POST",
        body: JSON.stringify({
          staffID,
        }),
      });
      const decodedRes = await res.json();
      if (decodedRes.errors) {
        throw decodedRes.errors;
      }
      setIsStaffDataLoading(false);
      setStaffData(decodedRes.data);
    } catch (err) {
      const errContent = Array.isArray(err) ? err : (err as any).message;
      setIsStaffDataLoading(false);
      setAlertStatus("error");
      setAlertTitle("Failed fetching staff data");
      setAlertContent(errContent);
    }
  };

  const fetchKeyCopiesData = async () => {
    try {
      const { staffID } = parseURL(ROUTE_STAFFS_VIEW);
      const res = await fetch(API_KEYCOPIES_LIST_BY_STAFF, {
        method: "POST",
        body: JSON.stringify({
          staffID,
          filter: debouncedFilterValue,
          page: currentPage,
        }),
      });
      const decodedRes = await res.json();
      if (decodedRes.errors) {
        throw decodedRes.errors;
      }
      setIsKeyCopiesDataLoading(false);
      setKeyCopiesData(decodedRes.data);
    } catch (err) {
      const errContent = Array.isArray(err) ? err : (err as any).message;
      setIsKeyCopiesDataLoading(false);
      setAlertStatus("error");
      setAlertTitle("Failed fetching key copies data");
      setAlertContent(errContent);
    }
  };

  const disassociateKeyCopy = async (keyID: string) => {
    try {
      // Mark loading
      setAlertStatus("info");
      setAlertTitle(`Diassociating key "${keyID}" ...`);
      setAlertContent(null);
      // Send request
      const res = await fetch(API_KEYCOPIES_UPDATE, {
        method: "POST",
        body: JSON.stringify({
          keyID: keyID,
          staffID: null,
        }),
      });
      const decodedRes = await res.json();
      if (decodedRes.errors) {
        throw decodedRes.errors;
      } else {
        setAlertStatus("success");
        setAlertTitle(`Removed key "${keyID}" from staff...`);
        setAlertContent(null);
        fetchKeyCopiesData();
      }
    } catch (err) {
      const errContent = Array.isArray(err) ? err : (err as any).message;
      setAlertStatus("error");
      setAlertTitle(`Failed diassociating key "${keyID}"`);
      setAlertContent(errContent);
    }
  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
    debouncedSetDebouncedFilterValueRef.current(e.target.value);
  };

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  // ------------------------------------------------------------
  // Effects
  // ------------------------------------------------------------

  useEffect(() => {
    document.title = `View Keychain | Portier Demo`;
    fetchStaffData();
  }, []);

  useEffect(() => {
    fetchKeyCopiesData();
  }, [debouncedFilterValue, currentPage]);

  // ------------------------------------------------------------
  // Renders
  // ------------------------------------------------------------

  let displayedRecordStr = "";
  if (keyCopiesData) {
    const totalRecords = keyCopiesData.Count;
    const pageSize = keyCopiesData.PageSize;
    const startRecordNo = Math.min(
      (currentPage - 1) * pageSize + 1,
      totalRecords
    );
    const endRecordNo = Math.min(currentPage * pageSize, totalRecords);
    displayedRecordStr = `Displaying records ${startRecordNo}–${endRecordNo} of ${totalRecords}.`;
  }

  return (
    <>
      <header>
        <Header />
      </header>

      <main>
        {alertStatus && (
          <Box mb={4}>
            <Alert
              status={alertStatus}
              title={alertTitle}
              content={alertContent}
            />
          </Box>
        )}

        {/* Staff data section */}
        <Text mb={2} textStyle="2xl" style={{ fontWeight: 700 }}>
          Staff data
        </Text>
        <Card.Root mb={4} variant="subtle">
          <Card.Body gap="2">
            {isStaffDataLoading && (
              <VStack>
                <Spinner size="xl" />
              </VStack>
            )}
            {!isStaffDataLoading && !staffData && (
              <VStack>That keychain is not found.</VStack>
            )}
            {!isStaffDataLoading && staffData && (
              <VStack alignItems="stretch">
                <VStack alignItems="stretch" gap={0}>
                  <div style={{ fontWeight: 700 }}>Staff ID</div>
                  <div>{staffData.StaffID}</div>
                </VStack>
                <VStack alignItems="stretch" gap={0}>
                  <div style={{ fontWeight: 700 }}>Name</div>
                  <div>{staffData.Name}</div>
                </VStack>
                <VStack alignItems="stretch" gap={0}>
                  <div style={{ fontWeight: 700 }}>Date created</div>
                  <div>{staffData.DateCreated}</div>
                </VStack>
              </VStack>
            )}
          </Card.Body>
          {!isStaffDataLoading && staffData && (
            <Card.Footer justifyContent="flex-end">
              <Button
                variant="outline"
                onClick={() => setIsUpdateStaffModalOpen(true)}
              >
                Edit
              </Button>
              <Button
                colorPalette="red"
                onClick={() => setIsDeleteStaffModalOpen(true)}
              >
                Delete
              </Button>
            </Card.Footer>
          )}
        </Card.Root>

        {/* Filter section */}
        <Box as="section" mt={8}>
          <Text mb={2} textStyle="2xl" style={{ fontWeight: 700 }}>
            Associated key copies
          </Text>
          <HStack>
            <Input
              variant="outline"
              placeholder="Filter by key ID or keychain description/ID ..."
              onChange={handleFilterChange}
              value={filterValue}
            />
          </HStack>
        </Box>
        {keyCopiesData && (
          <Box as="section" mt={8}>
            <b>{displayedRecordStr}</b>
            {/* Results */}
            <VStack mt={4}>
              {keyCopiesData.KeyCopies.map((item: any) => {
                const { KeyID } = item;
                return (
                  <KeyCopyCard
                    key={KeyID}
                    keyCopyData={item}
                    onRequestDisassociate={() => {
                      disassociateKeyCopy(KeyID);
                    }}
                  />
                );
              })}
            </VStack>
            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              maxPage={keyCopiesData.MaxPage}
              onChangePage={handleChangePage}
            />
          </Box>
        )}

        {/* Modals */}
        {/* <UpdateStaffModal
          keychainData={keychainData}
          isOpen={isUpdateStaffModalOpen}
          onClose={() => setIsUpdateStaffModalOpen(false)}
          onSuccess={() => fetchKeychainData()}
        />
        <DeleteStaffModal
          keychainData={keychainData}
          isOpen={isDeleteStaffModalOpen}
          onClose={() => setIsDeleteStaffModalOpen(false)}
        /> */}
      </main>
    </>
  );
}
