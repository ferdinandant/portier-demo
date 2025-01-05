import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Input,
  Button,
  HStack,
  Box,
  Spinner,
  Center,
  VStack,
  Text,
} from "@chakra-ui/react";
import { BsLink45Deg } from "react-icons/bs";

// Components
import Header from "../../../components/site/Header/Header";
import Alert from "../../../components/ui/Alert/Alert";
import SelectableCard from "../../../components/ui/SelectableCard/SelectableCard";
import Pagination from "../../../components/ui/Pagination/Pagination";
import CreateKeychainModal from "./CreateKeychainModal";

// Constants
import { ROUTE_KEYCHAINS_VIEW } from "../../../constants/routes";
import { API_KEYCHAINS_LIST } from "../../../constants/api";

// Utils
import debounce from "../../../utils/timing/debounce";
import substituteURL from "../../../utils/url/substituteURL";

// ================================================================================
// MAIN
// ================================================================================

export default function KeychainsListPage() {
  // Filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [debouncedFilterValue, setDebouncedFilterValue] = useState("");
  const debouncedSetDebouncedFilterValueRef = useRef(
    debounce(300, (value: string) => {
      setDebouncedFilterValue(value);
    })
  );

  // Data states
  const [isLoading, setIsLoading] = useState(true);
  const [errorTitle, setErrorTitle] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[] | null>([]);
  const [data, setData] = useState<any>();

  // Modal states
  const [isCreateKeychainModalOpen, setIsCreateKeychainModalOpen] =
    useState(false);

  // ------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(API_KEYCHAINS_LIST, {
        method: "POST",
        body: JSON.stringify({
          filter: debouncedFilterValue,
          page: currentPage,
        }),
      });
      const decodedRes = await res.json();
      if (decodedRes.errors) {
        throw decodedRes.errors;
      }
      setIsLoading(false);
      setData(decodedRes.data);
    } catch (err) {
      const errContent = Array.isArray(err) ? err : (err as any).message;
      setIsLoading(false);
      setData(null);
      setErrorTitle("Error fetching keychains");
      setErrors(errContent);
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
    fetchData();
  }, [debouncedFilterValue, currentPage]);

  useEffect(() => {
    document.title = `Keychains List | Portier Demo`;
  }, []);

  // ------------------------------------------------------------
  // Renders
  // ------------------------------------------------------------

  let displayedRecordStr = "";
  if (data) {
    const totalRecords = data.Count;
    const pageSize = data.PageSize;
    const startRecordNo = Math.min(
      (currentPage - 1) * pageSize + 1,
      totalRecords
    );
    const endRecordNo = Math.min(currentPage * pageSize, totalRecords);
    displayedRecordStr = `Displaying records ${startRecordNo}–${endRecordNo} of ${totalRecords} record(s).`;
  }

  return (
    <>
      <header>
        <Header />
      </header>

      <main>
        {/* Filter section */}
        <section>
          <HStack>
            <Input
              variant="outline"
              placeholder="Filter by description ..."
              onChange={handleFilterChange}
              value={filterValue}
            />
            <Button
              colorPalette="green"
              onClick={() => setIsCreateKeychainModalOpen(true)}
            >
              Create
            </Button>
          </HStack>
        </section>

        {/* Table section*/}
        {isLoading && (
          <Box as="section" mt={8}>
            <Center>
              <Spinner size="xl" />
            </Center>
          </Box>
        )}
        {!isLoading && errors && errors.length > 0 && (
          <Box as="section" mt={8}>
            {errors && errors.length > 0 && (
              <Alert status="error" title={errorTitle} content={errors} />
            )}
          </Box>
        )}
        {!isLoading && data && (
          <Box as="section" mt={8}>
            <b>{displayedRecordStr}</b>
            {/* Results */}
            <VStack mt={4}>
              {data.Keychains.map((item: any) => {
                const { KeychainID, Description } = item;
                const href = substituteURL(ROUTE_KEYCHAINS_VIEW, {
                  keychainID: KeychainID,
                });
                return (
                  <SelectableCard href={href} key={KeychainID}>
                    <HStack alignItems="start">
                      <div>
                        <BsLink45Deg size={48} />
                      </div>
                      <VStack>
                        <Text
                          textStyle="lg"
                          style={{ width: "100%", fontWeight: 600 }}
                        >
                          {Description}
                        </Text>
                        <div style={{ width: "100%", color: "#64748b" }}>
                          {KeychainID}
                        </div>
                      </VStack>
                    </HStack>
                  </SelectableCard>
                );
              })}
            </VStack>
            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              maxPage={data.MaxPage}
              onChangePage={handleChangePage}
            />
          </Box>
        )}
      </main>

      <CreateKeychainModal
        isOpen={isCreateKeychainModalOpen}
        onClose={() => setIsCreateKeychainModalOpen(false)}
        onSuccess={() => fetchData()}
      />
    </>
  );
}
