import { useRef, useState } from "react";
import Data from "./Data";

function Template() {
    const [studentList, setStudentList] = useState(Data);
    const [branchList, setBranchList] = useState(["CS", "IT", "CV", "MECH"]);
    const [defaultBranch, setDefaultBranch] = useState("ALL");
    const [genderData,setgenderData] = useState("");
   
    const addStudent = () => {
        let roll = rollRef.current.value;
        let name = nameRef.current.value;
        let branch = branchRef.current.value;
        let gender = genderRef.current.value;
        let maleRef = genderRef.current.value;
        if(maleRef){
            setgenderData("Male");
        }
        else{
            setgenderData("Female");
        }
        setStudentList([...studentList, { roll, name, branch, gender }]);
    };

    const remove = (rollNumber) => {
        if (window.confirm("Do you want to delete it?")) {
            let index = studentList.findIndex((student) => student.roll === rollNumber);
            const updatedList = [...studentList];
            updatedList.splice(index, 1);
            setStudentList(updatedList);
        }
    };

    const rollRef = useRef(null);
    const nameRef = useRef(null);
    const genderRef = useRef(null);
    const branchRef = useRef(null);
    const maleRef = useRef(null);
    const femaleRef = useRef(null);

    return (
        <>
            <div className="container mt-3" style={{ width: "1000px", backgroundColor: "#87d588", padding: "30px" }}>
                <div className="row">
                    <div className="col-md-6">
                        <input ref={rollRef} id="roll" type="text" className="form-control" placeholder="Enter roll number" style={{ background: "transparent" }} />
                    </div>
                    <div className="col-md-6">
                        <input ref={nameRef} id="name" type="text" className="form-control" placeholder="Enter student name" style={{ background: "transparent" }} />
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-md-6">
                        <select ref={genderRef} id="gender" className="form-control" style={{ background: "transparent" }}>
                            <option value="0">Select gender</option>
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <select ref={branchRef} id="branch" className="form-control" style={{ background: "transparent" }}>
                            <option value="0">Select branch</option>
                            {branchList.map((branch, index) => (
                                <option value={branch} key={index}>{branch}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-md-6">
                        <button onClick={addStudent} className="btn btn-success">ADD</button>
                        <label htmlFor="Male" style={{ margin: "5px" }}>Male</label>
                        <input ref={maleRef} type="radio" name="gender" id="Male" />
                        <label htmlFor="Female" style={{ margin: "5px" }}>Female</label>
                        <input ref={femaleRef} type="radio" name="gender" id="Female" />
                    </div>
                    <div className="col-md-6">
                        <button onClick={() => setDefaultBranch("CS")} className="btn btn-outline-primary">CS</button>
                        <button onClick={() => setDefaultBranch("IT")} className="btn btn-outline-warning ml-2">IT</button>
                        <button onClick={() => setDefaultBranch("CV")} className="btn btn-outline-dark ml-2">CV</button>
                        <button onClick={() => setDefaultBranch("MECH")} className="btn btn-outline-info ml-2">MECH</button>
                        <button onClick={() => setDefaultBranch("ALL")} className="btn btn-outline-secondary ml-2">ALL</button>
                    </div>
                </div>
                <div className="container mt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Roll no.</th>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Branch</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentList
                                .filter((student) => student.branch === defaultBranch || defaultBranch === "ALL")
                                .filter((data)=> data.gender === genderData || data)
                                .map((data, index) => (
                            <tr key={index}>
                                <td>{data.roll}</td>
                                <td>{data.name}</td>
                                <td>{data.gender}</td>
                                <td>{data.branch}</td>
                                <td>
                                    <button onClick={() => remove(data.roll)} className="btn btn-outline-danger">Remove</button>
                                </td>
                            </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Template;
