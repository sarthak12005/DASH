import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Components/navbar";

const dailyMission = ["DailyTasks", "Words"];

const Daily = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    }

    return (
        <>
            <Navbar />
            <div className="header w-screen h-screen mt-16 bg-amber-400 ">
                <h1 className="text-[white] text-[40px] text-center  ">Choose your Topic</h1>
                <div className="boxes flex gap-5 bg-amber-400 p-10 m-2.5 ">
                    {dailyMission.map((mission, index) => (
                        <motion.div
                            key={index}
                            className="mission-card bg-white shadow-lg rounded-lg p-4 m-4 w-[300px] h-[280px] cursor-pointer hover:shadow-xl transition-shadow duration-300"
                            onClick={() => handleNavigate(`/daily/${mission.toLowerCase()}`)}
                        >
                            <h2 className="text-xl font-bold text-center">{mission}</h2>
                        </motion.div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Daily;