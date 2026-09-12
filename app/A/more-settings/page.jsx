"use client";
import ALayout from "@/components/ALayout";
import NavBar from "@/components/Avance/NavBar";
import { useDataContext } from "@/context/DataProvider";
import { useEffect, useState } from "react";
import AddGrades from "@/components/Avance/AddGrades";
import { brightness } from "color-tin";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { base_api_path } from "@/utils/reportList";
import { colorTin } from "color-tin";
import { CgSpinner } from "react-icons/cg";
import { BiTrash } from "react-icons/bi";
import { getToken } from "@/utils";

export default function MoreSettings() {
  const { theme_bg, main_school_info } = useDataContext();
  let range = { i: 0, lower_limit: "", upper_limit: "", grade: "" };
  const [grade, setGrade] = useState([range]);
  const [subsidiaryGrade, setSubsidiaryGrade] = useState([range]);
  const [isSubsidiary, setIsSubsidiary] = useState("Principle");
  const [importantDate, setImportantDate] = useState({
    put_position: false,
    begins: "",
    ends: "",
  });
  const [watch, setWatch] = useState(false);
  const [fetchedGrade, setFetchGrade] = useState(null);
  const [selecting, setSelecting] = useState(false);
  //auth
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (main_school_info) return router.push(pathname);
    if (!main_school_info) return router.push("/");
  }, []);
  //
  useEffect(() => {
    let important_data = localStorage.getItem("importantData");
    if (important_data) {
      setImportantDate(JSON.parse(important_data));
    }
  }, [importantDate?.put_position, watch]);

  //fetch grade
  useEffect(() => {
    async function sendGrade() {
      try {
        let result = await axios.get(
          `${base_api_path}school/get-school-grade`,
          { headers: { Authorization: `Bearer ${getToken('access_token')}` } },
        );
        setFetchGrade(result.data);
      } catch (error) {
        console.log(error);
      }
    }
    sendGrade();
  }, [selecting]);

  function editRange(e, data) {
    if (isSubsidiary === "Principle") {
      setGrade(
        grade.map((g) =>
          g.i === data.i ? { ...data, [data.name]: e.target.value } : { ...g },
        ),
      );
    } else {
      setSubsidiaryGrade(
        grade.map((g) =>
          g.i === data.i ? { ...data, [data.name]: e.target.value } : { ...g },
        ),
      );
    }
  }

  function putPosition(value) {
    localStorage.setItem(
      "importantData",
      JSON.stringify({ ...importantDate, put_position: !value }),
    );
    setImportantDate({ ...importantDate, put_position: !value });
  }
  // saveDate to ocal storage
  function saveDate() {
    localStorage.setItem("importantData", JSON.stringify({ ...importantDate }));
    setWatch((prev) => !prev);
  }

  // select grade
  async function slectGrade(id, is_subsidiary) {
    let selected_id = id ? id : 0;
    try {
      setSelecting((prev) => !prev);
      let result = await axios.post(
        `${base_api_path}school/select-grade/${selected_id}/${is_subsidiary}`,
        {},
        { headers: { Authorization: `Bearer ${getToken('access_token')}` } },
      );
      setSelecting((prev) => !prev);
    } catch (error) {
      setSelecting((prev) => !prev);
      console.log(error);
    }
  }

  // delete grade
  async function deleteGrade(id) {
    try {
      setSelecting((prev) => !prev);
      await axios.delete(`${base_api_path}school/delete-grade/${id}`, {
        headers: { Authorization: `Bearer ${getToken('access_token')}` },
      });
      setSelecting((prev) => !prev);
    } catch (error) {
      setSelecting((prev) => !prev);
      console.log(error);
    }
  }
  //

  return (
    <ALayout>
      <div className="flex-1 pl-1">
        <NavBar heading={"Settings"} />
        <div className="flex gap-2 items-center py-1 mt-3 bg-white shadow-sm rounded p-1">
          <h1 className="font-bold text-sm mt-2 " style={{ color: theme_bg }}>
            Runk Students
          </h1>
          <div
            onClick={() => putPosition(importantDate.put_position)}
            className="flex justify-center items-center cursor-pointer bg-white mt-2 "
            style={{ border: "1px solid gray", height: 17, width: 17 }}
          >
            {importantDate?.put_position == true && (
              <div style={{ height: 10, width: 10, background: theme_bg }} />
            )}
          </div>
        </div>
        <hr className="my-3" style={{ height: 2, background: "#fff" }} />
        <div className="my-5 bg-white shadow-sm rounded p-1">
          <h2 className="font-bold text-sm mt-2 " style={{ color: theme_bg }}>
            Important Date
          </h2>
          <div className="mt-1 text-sm font-bold">
            Next Term begins On
            <input
              value={importantDate?.begins}
              onChange={(e) =>
                setImportantDate({ ...importantDate, begins: e.target.value })
              }
              className="p-1 border font-normal mx-1"
              type="text"
            />
            and ends on{" "}
            <input
              value={importantDate.ends}
              onChange={(e) =>
                setImportantDate({ ...importantDate, ends: e.target.value })
              }
              className="p-1 border font-normal mx-1"
              type="text"
            />
          </div>
          <button
            onClick={saveDate}
            className="mt-3 rounded cursor-pointer px-10 text-sm"
            style={{
              background: theme_bg,
              color: brightness(theme_bg) < 60 ? "#fff" : theme_bg,
            }}
          >
            Save
          </button>
        </div>
        <hr className="my-3" style={{ height: 2, background: "#fff" }} />
        <div className="flex gap-3">
          {["Principle", "Subsidiary"].map((btn) => (
            <button
              key={btn}
              className="rounded text-sm shadow-lg pointer mt-3 px-2"
              onClick={() => setIsSubsidiary(btn)}
              style={{
                background: btn === isSubsidiary ? theme_bg : "#fff",
                color:
                  btn === isSubsidiary
                    ? brightness(theme_bg) < 60
                      ? "#fff"
                      : theme_bg
                    : "#000",
              }}
            >
              {btn}
            </button>
          ))}
        </div>
        {isSubsidiary === "Principle" ? (
          <AddGrades
            sscar_code={main_school_info.sscar_code}
            isSubsidiary={isSubsidiary}
            range={range}
            grade={grade}
            editRange={editRange}
            setGrade={setGrade}
          />
        ) : (
          <AddGrades
            sscar_code={main_school_info.sscar_code}
            isSubsidiary={isSubsidiary}
            range={range}
            grade={subsidiaryGrade}
            editRange={editRange}
            setGrade={setSubsidiaryGrade}
          />
        )}

        <div className="my-5 bg-white rounded pl-2">
          {fetchedGrade && (
            <div className="w-full border-b-gray-400 gap-5 ">
              {isSubsidiary=='Principle' && <>
              <h2>Grade of Principle subjects</h2>
              {fetchedGrade?.principle?.map((data, i) => {
                let grades = data.id ? data.grade : data;
                return (
                  <div
                    key={i}
                    onClick={() => slectGrade(data?.id, data?.is_subsidiary)}
                    className="w-full flex gap-2 flex-row flex-wrap px-1 my-2 text-sm border-b-2 py-3 cursor-pointer"
                    style={{
                      backgroundColor:
                        data?.is_selected == true
                          ? colorTin(theme_bg, 10).lighter_80
                          : "white",
                    }}
                  >
                    {Object.keys(grades).map((g) => (
                      <span
                        key={g}
                        className="flex gap-1 py-1 px-2 rounded"
                        style={{
                          backgroundColor: colorTin(theme_bg, 10).lighter_50,
                        }}
                      >
                        <span>{g}</span>
                        <span>:</span>
                        <span>{grades[g]}</span>
                      </span>
                    ))}
                    {selecting && (
                      <CgSpinner className="animate-spin text-2xl" />
                    )}
                    {i > 0 && (
                      <BiTrash
                        onClick={() => deleteGrade(data?.id)}
                        className="text-xl text-red-700"
                      />
                    )}
                  </div>
                );
              })}
              </>}
              
                {isSubsidiary!=='Principle' && <>
                <h2>Grade of Subsidiary subjects</h2>
                {fetchedGrade?.subsidiary?.map((data, i) => {
                  let grades = data.id ? data.grade : data;
                  return (
                    <div
                      key={i}
                      onClick={() => slectGrade(data?.id, data?.is_subsidiary)}
                      className="w-full flex gap-2 flex-row flex-wrap px-1 my-2 text-sm border-b-2 py-3 cursor-pointer"
                      style={{
                        backgroundColor:
                          data?.is_selected == true
                            ? colorTin(theme_bg, 10).lighter_80
                            : "white",
                      }}
                    >
                      {Object.keys(grades).map((g) => (
                        <span
                          key={g}
                          className="flex gap-1 py-1 px-2 rounded"
                          style={{
                            backgroundColor: colorTin(theme_bg, 10).lighter_10,
                            color:'white'
                          }}
                        >
                          <span>{g}</span>
                          <span>:</span>
                          <span>{grades[g]}</span>
                        </span>
                      ))}
                      {selecting && (
                        <CgSpinner className="animate-spin text-2xl" />
                      )}
                      {i > 0 && (
                        <BiTrash
                          onClick={() => deleteGrade(data?.id)}
                          className="text-xl text-red-600"
                        />
                      )}
                    </div>
                  );
                })}
                </>}
            </div>
          )}
        </div>
      </div>
    </ALayout>
  );
}
