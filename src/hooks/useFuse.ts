import Fuse from "fuse.js";
import { useState } from "react";

function fuzzySearch({ fuse, data, term }) {
  const results = fuse.search(term);
  return term ? results.map((result) => result.item) : data;
}

function useFuse({ data, options }) {
  const [term, setTerm] = useState<string>("");
  const fuseOptions = {
    ...options,
  };
  const fuse = new Fuse(data || [], fuseOptions);
  const result = fuzzySearch({ fuse, data, term });
  const reset = () => setTerm("");
  return {
    result,
    search: setTerm,
    term,
    reset,
  };
}

export default useFuse;
