export default function Pagination(props) {
  const { toPrev, toNext } = props;

  return (
    <div className="mt-8 flex justify-center">
      <button
        disabled={toPrev == null}
        onClick={toPrev?? null}
        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <button
        disabled={toNext == null}
        onClick={toNext?? null}
        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed ml-4"
      >
        Next
      </button>
    </div>
  );
}
