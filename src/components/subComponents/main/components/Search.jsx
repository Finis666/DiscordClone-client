import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
function Search(props) {
  return (
    <div className="relative w-full flex items-center">
      <input
        type="text"
        placeholder="Search"
        className="ml-9 w-[90%] bg-[#202225] text-[#5d6066] h-8 rounded-[3px] pl-3 font-poopins empty:text-white"
        onChange={(e) => props.setSearchTerm(e.target.value)}
      />
      <AiOutlineSearch
        color="white"
        size={"20px"}
        className="relative top-[0px] right-[30px]"
      />
    </div>
  );
}

export default Search;
