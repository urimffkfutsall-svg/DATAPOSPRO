import React from "react";

const Dashboard = () => {

const handleReset = async (type) => {
const labels = { day: "ditore", month: "mujore", year: "vjetore", all: "te gjitha" };
if (!window.confirm("A jeni i sigurt qe doni te fshini te dhenat " + labels[type] + "?")) return;
try {
const token = localStorage.getItem("token");
await fetch("/api/reset/" + type, {
method: "DELETE",
headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
});
alert("Resetimi " + labels[type] + " u krye me sukses!");
} catch (err) {
alert("Ndodhi nje gabim gjate resetimit!");
}
};

return (
<div className="space-y-6 p-6">
<div className="mt-4 p-5 border-2 border-red-400 rounded-xl bg-red-50">
<h3 className="text-red-700 font-bold text-lg mb-4">Zona e Resetimit</h3>
<div className="flex flex-wrap gap-3 mb-3">
<button onClick={() => handleReset("day")}   className="px-5 py-2 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600">Reseto Diten</button>
<button onClick={() => handleReset("month")} className="px-5 py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600">Reseto Muajin</button>
<button onClick={() => handleReset("year")}  className="px-5 py-2 bg-red-600   text-white rounded-lg font-bold hover:bg-red-700">Reseto Vitin</button>
<button onClick={() => handleReset("all")}   className="px-5 py-2 bg-red-900   text-white rounded-lg font-bold hover:bg-red-950">Reseto Te Gjitha</button>
</div>
<p className="text-red-600 text-sm">Kujdes: Resetimi fshin shitjet, transaksionet, klientet dhe raportet!</p>
</div>
</div>
);
};

export default Dashboard;
