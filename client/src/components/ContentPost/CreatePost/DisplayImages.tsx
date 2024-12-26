const DisplayImages = ({ selectImageList }: { selectImageList: string[] }) => {
  return (
    <div className="w-full h-auto">
      {selectImageList.length === 1 && (
        <div className="w-full h-auto">
          <img
            loading="lazy"
            src={selectImageList[0]}
            alt="anh"
            className="w-full h-full rounded-lg"
          />
        </div>
      )}
      {selectImageList.length === 2 && (
        <div className="grid grid-cols-2 h-full">
          {selectImageList.map((item, idx) => (
            <div key={idx}>
              <img
                src={item}
                alt={`image${idx}`}
                className="h-full rounded-lg object-cover"
              />
            </div>
          ))}
        </div>
      )}
      {selectImageList.length === 3 && (
        <div className="grid grid-cols-2 grid-rows-2 h-[466px]">
          {selectImageList.map((item, idx) => (
            <div key={idx} className="w-full h-auto">
              <img
                src={item}
                alt={`image${idx}`}
                className="w-full h-full rounded-lg object-cover"
              />
            </div>
          ))}
        </div>
      )}
      {selectImageList.length === 4 && (
        <div className="grid grid-cols-2 grid-rows-2 h-[388.333px]">
          {selectImageList.map((item, idx) => (
            <div key={idx} className="col-span-1 h-auto">
              <img
                src={item}
                alt={`image${idx}`}
                className="w-full h-full rounded-lg object-cover"
              />
            </div>
          ))}
        </div>
      )}
      {selectImageList.length >= 5 && (
        <div className="grid grid-rows-2 h-[388.333px]">
          <div className="grid grid-cols-2">
            {selectImageList.slice(0, 2).map((item, idx) => (
              <div key={idx}>
                <img
                  src={item}
                  alt={`image${idx}`}
                  className="col-span-1 rounded-lg h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3">
            {selectImageList
              .slice(2, selectImageList.length)
              .map((item, idx) => (
                <>
                  <div
                    key={idx}
                    className={`${idx === 2 ? "relative bg-[#83828C]" : ""} ${
                      idx > 2 && "hidden"
                    }`}
                  >
                    <img
                      src={item}
                      alt={`image${idx}`}
                      className="col-span-1 rounded-lg h-full w-full object-cover"
                    />
                    {selectImageList.length > 5 && idx === 2 && (
                      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                        <span className="text-white text-[40px]">
                          +{selectImageList.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayImages;
