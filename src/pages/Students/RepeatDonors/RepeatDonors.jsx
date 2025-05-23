import React, { useContext, useEffect, useMemo, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconEdit } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { encryptId } from "../../../utils/encyrption/Encyrption";
import { navigateToRepeatDonorEdit, REAPEAT_DONOR_LIST } from "../../../api";

const RepeatDonors = () => {
  const [repeatDonor, setRepeatDonor] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentYear = localStorage.getItem("currentYear")
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  // Fetch repeat donor data
  const fetchRepeatDonorData = async () => {
   
    setLoading(true);
    try {
      const response = await axios.get(
        `${REAPEAT_DONOR_LIST}/${currentYear}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRepeatDonor(response.data?.receipts || []);
    } catch (error) {
      console.error("Error fetching repeat donor data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch repeat donor data when currentYear changes
  useEffect(() => {
    if (currentYear) {
      fetchRepeatDonorData();
    }
  }, [currentYear]);
  const columns = useMemo(
    () => [
      {
        accessorKey: "individual_company.indicomp_full_name",
        header: "Full Name",
        size: 50,
        accessorFn: (row) => {
          return row?.individual_company?.indicomp_full_name || null;
        },
        Cell: ({ row }) => {
          const fullName = row.original.individual_company.indicomp_full_name;
          return <span>{fullName ? fullName : ""}</span>;
        },
      },
      {
        accessorKey: "individual_company.indicomp_type",
        header: "Type",
        size: 50,
        accessorFn: (row) => {
          return row?.individual_company?.indicomp_type || null;
        },
        Cell: ({ row }) => {
          const type = row.original.individual_company.indicomp_type;
          return type;
        },
      },
      {
        accessorKey: "individual_company.indicomp_mobile_phone",
        header: "Mobile",
        size: 50,
        accessorFn: (row) => {
          return row?.individual_company?.indicomp_mobile_phone || null;
        },
        Cell: ({ row }) => {
          const mobile = row.original.individual_company.indicomp_mobile_phone;
          return !mobile || mobile === "null" ? "N/A" : mobile;
        },
      },
      {
        accessorKey: "individual_company.indicomp_email",
        header: "Email",
        size: 50,
        accessorFn: (row) => {
          return row?.individual_company?.indicomp_email || null;
        },
        Cell: ({ row }) => {
          const email = row.original.individual_company.indicomp_email;
          return email;
        },
      },

      {
        id: "id",
        header: localStorage.getItem("id") === "1" ? "Alloted List" : "",
        size: 50,
        enableHiding: false,
        Cell: ({ row }) => {
          const id = row.original.indicomp_fts_id;
          

          return (
            <div className="flex gap-2">
              <div
                // onClick={() => {
                //   const encryptedId = encryptId(id);
                //   navigate(
                //     `/repeat-donor-allot/${encodeURIComponent(encryptedId)}`
                //   );
                // }}
             onClick={() => {
              navigateToRepeatDonorEdit(navigate,id)
                                           }}
                className="flex items-center space-x-2"
                title="Edit"
                style={{
                  display: localStorage.getItem("id") == 1 ? "" : "none",
                }}
              >
                <IconEdit className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: repeatDonor || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableHiding: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    state: { 
      
      isLoading: loading ,
     
    },
    mantineTableContainerProps: { sx: { maxHeight: "400px" } },
    mantineProgressProps: {
      color: 'blue',
      variant: 'bars', 
    },
    renderTopToolbarCustomActions: () => (
      <h2 className="text-lg font-bold text-black px-4">
         Repeat Donor List
      </h2>
    ),
  });

  return (
    <Layout>
       <div className="max-w-screen">
             <MantineReactTable table={table} />
           </div>
    </Layout>
  );
};

export default RepeatDonors;
