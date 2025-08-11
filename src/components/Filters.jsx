// import { defaultAllowedOrigins } from "vite";

const Filters = ({ selectedType, setSelectedType }) => {
  return (
    <div className="filter-bar">
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
      >
        <option value="all">All</option>
        <option value="stock">Stock</option>
        <option value="crypto">Crypto</option>
        <option value="bond">Bond</option>
      </select>
    </div>
  );
};

export default Filters;
