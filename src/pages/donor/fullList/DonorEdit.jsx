import React, { useContext, useEffect, useState } from "react";
import DonorEditIndv from "./DonorEditIndv";
import DonorEditComp from "./DonorEditComp";
import { useParams } from "react-router-dom";
import Layout from "../../../layout/Layout";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";
import { Spinner } from "@material-tailwind/react";
import { decryptId } from "../../../utils/encyrption/Encyrption";
import { ContextPanel } from "../../../utils/ContextPanel";

const DonorEdit = () => {
  const { id } = useParams();

  const decryptedId = decryptId(id);
  const [usertype, setUsertype] = useState("");
  const [loading, setLoading] = useState(true);
  const { isPanelUp } = useContext(ContextPanel);
  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/fetch-donor-for-edit/${decryptedId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const donType = response.data.individualCompany.indicomp_type;
        localStorage.setItem("donType", donType);
        setUsertype(donType);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching donor data", error);
        setLoading(false);
      }
    };

    fetchDonorData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner />
        </div>
      </Layout>
    );
  }

  const type = localStorage.getItem("donType");

  if (type == "Individual") {
    return (
      <Layout>
        <DonorEditIndv id={decryptedId} isPanelUp={isPanelUp}/>
      </Layout>
    );
  }
  return (
    <Layout>
      <DonorEditComp id={decryptedId} isPanelUp={isPanelUp} />
    </Layout>
  );
};

export default DonorEdit;
