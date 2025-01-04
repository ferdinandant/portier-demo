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
import { BsFillKeyFill } from "react-icons/bs";

// Components
import Header from "../../../components/site/Header/Header";
import Alert, { AlertStatus } from "../../../components/ui/Alert/Alert";
import SelectableCard from "../../../components/ui/SelectableCard/SelectableCard";
import Pagination from "../../../components/ui/Pagination/Pagination";
import UpdateKeychainModal from "./UpdateKeychainModal";
import DeleteKeychainModal from "./DeleteKeychainModal";

// Constants
import {
  API_KEYCHAINS_VIEW,
  API_KEYCOPIES_LIST_BY_KEYCHAIN,
} from "../../../constants/api";
import { ROUTE_KEYCHAINS_VIEW } from "../../../constants/routes";

// Utils
import debounce from "../../../utils/timing/debounce";
import parseURL from "../../../utils/url/parseURL";

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
  const [isKeychainDataLoading, setIsKeychainDataLoading] = useState(true);
  const [isKeyCopiesDataLoading, setIsKeyCopiesDataLoading] = useState(true);
  const [keychainData, setKeychainData] = useState<any>();
  const [keyCopiesData, setKeyCopiesData] = useState<any>();

  // Modal state
  const [isUpdateKeychainModalOpen, setIsUpdateKeychainModalOpen] =
    useState(false);
  const [isDeleteKeychainModalOpen, setIsDeleteKeychainModalOpen] =
    useState(false);

  // ------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------

  const fetchKeychainData = async () => {
    try {
      const { keychainID } = parseURL(ROUTE_KEYCHAINS_VIEW);
      const res = await fetch(API_KEYCHAINS_VIEW, {
        method: "POST",
        body: JSON.stringify({
          keychainID,
        }),
      });
      const decodedRes = await res.json();
      if (decodedRes.errors) {
        throw decodedRes.errors;
      }
      setIsKeychainDataLoading(false);
      setKeychainData(decodedRes.data);
    } catch (err) {
      const errContent = Array.isArray(err) ? err : (err as any).message;
      setIsKeychainDataLoading(false);
      setAlertStatus("error");
      setAlertTitle("Failed fetching keychain data");
      setAlertContent(errContent);
    }
  };

  const fetchKeyCopiesData = async () => {
    try {
      const { keychainID } = parseURL(ROUTE_KEYCHAINS_VIEW);
      const res = await fetch(API_KEYCOPIES_LIST_BY_KEYCHAIN, {
        method: "POST",
        body: JSON.stringify({
          keychainID,
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
      console.log(decodedRes);
    } catch (err) {
      const errContent = Array.isArray(err) ? err : (err as any).message;
      setIsKeyCopiesDataLoading(false);
      setAlertStatus("error");
      setAlertTitle("Failed fetching key copies data");
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
    // document.title = `View Keychain | Portier Demo`;
    fetchKeychainData();
  }, []);

  useEffect(() => {
    fetchKeyCopiesData();
  }, [debouncedFilterValue, currentPage]);

  // ------------------------------------------------------------
  // Renders
  // ------------------------------------------------------------

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

        {/* Keychain data section */}
        <Text mb={2} textStyle="2xl" style={{ fontWeight: 700 }}>
          Keychain data
        </Text>
        <Card.Root mb={4} variant="subtle">
          <Card.Body gap="2">
            {isKeychainDataLoading && (
              <VStack>
                <Spinner size="xl" />
              </VStack>
            )}
            {!isKeychainDataLoading && !keychainData && (
              <VStack>That keychain is not found.</VStack>
            )}
            {!isKeychainDataLoading && keychainData && (
              <VStack alignItems="stretch">
                <VStack alignItems="stretch" gap={0}>
                  <div style={{ fontWeight: 700 }}>Keychain ID</div>
                  <div>{keychainData.KeychainID}</div>
                </VStack>
                <VStack alignItems="stretch" gap={0}>
                  <div style={{ fontWeight: 700 }}>Description</div>
                  <div>{keychainData.Description}</div>
                </VStack>
                <VStack alignItems="stretch" gap={0}>
                  <div style={{ fontWeight: 700 }}>Date created</div>
                  <div>{keychainData.DateCreated}</div>
                </VStack>
              </VStack>
            )}
          </Card.Body>
          {!isKeychainDataLoading && keychainData && (
            <Card.Footer justifyContent="flex-end">
              <Button
                variant="outline"
                onClick={() => setIsUpdateKeychainModalOpen(true)}
              >
                Edit
              </Button>
              <Button
                colorPalette="red"
                onClick={() => setIsDeleteKeychainModalOpen(true)}
              >
                Delete
              </Button>
            </Card.Footer>
          )}
        </Card.Root>

        {/* Filter section */}
        <Box as="section" mt={8}>
          <Text mb={2} textStyle="2xl" style={{ fontWeight: 700 }}>
            Key copies
          </Text>
          <Input
            variant="outline"
            placeholder="Filter by key ID or bearer ID ..."
            onChange={handleFilterChange}
            value={filterValue}
          />
        </Box>
        {keyCopiesData && (
          <Box as="section" mt={8}>
            <b>
              Displaying {keyCopiesData.KeyCopies.length} of{" "}
              {keyCopiesData.Count} key copies.
            </b>
            {/* Results */}
            <VStack mt={4}>
              {keyCopiesData.KeyCopies.map((item: any) => {
                const { KeyID, DateCreated, StaffID, StaffName } = item;
                const hasAssignedStaff = StaffID.Valid;
                console.log(item);
                return (
                  <Card.Root key={KeyID} width={"full"}>
                    <Box p={4}>
                      <HStack alignItems="start">
                        <div>
                          <BsFillKeyFill size={48} />
                        </div>
                        <VStack gap={1} alignItems="stretch" flexGrow={1}>
                          <div>
                            <Text
                              textStyle="lg"
                              style={{ width: "100%", fontWeight: 600 }}
                            >
                              {KeyID}
                            </Text>
                            <div style={{ color: "#334155" }}>
                              Created at {DateCreated}
                            </div>
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
        <UpdateKeychainModal
          keychainData={keychainData}
          isOpen={isUpdateKeychainModalOpen}
          onClose={() => setIsUpdateKeychainModalOpen(false)}
          onSuccess={() => fetchKeychainData()}
        />
        <DeleteKeychainModal
          keychainData={keychainData}
          isOpen={isDeleteKeychainModalOpen}
          onClose={() => setIsDeleteKeychainModalOpen(false)}
        />
      </main>
    </>
  );
}
