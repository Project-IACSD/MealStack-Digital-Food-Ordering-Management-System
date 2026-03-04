import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import StudentNavBar from "../../components/StudentComponents/StudentNavBar";
import { useData } from "../../DataContext";
import AboutBackGround from "../../assets/about-background.png";
import TableColumnFilter from "../../components/common/TableColumnFilter";
import TableComponent from "../../components/common/TableComponent";
import { PreviousOrderTableColumns } from "../../components/StudentComponents/PreviousOrderTableColumns";

const PreviousOrdersList = () => {
  const columns = useMemo(() => PreviousOrderTableColumns, []);
  const { data } = useData();

  return (
    <div>
      <StudentNavBar />
      <div
        className="home-bannerImage-container"
        style={{ marginRight: "1400px" }}
      >
        <img src={AboutBackGround} alt="" />
      </div>
      <h3
        className="mb-4 header5"
        style={{ textAlign: "center", marginTop: "2.5rem" }}
      >
        Previous Orders List
      </h3>

      <TableComponent
        colStructure={columns}
        data={data}
        filterClass={TableColumnFilter}
      ></TableComponent>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link to="/customer/" className="btn btn-primary">
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default PreviousOrdersList;
