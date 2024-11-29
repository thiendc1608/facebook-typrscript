import { listObjectImageType } from "@/types";

const DisplayImages = ({
  listObjectImage,
}: {
  listObjectImage: listObjectImageType[];
}) => {
  return (
    <div className="w-full h-full">
      {listObjectImage.length === 1 && (
        <>
          {listObjectImage.map((item) => (
            <div key={item.id} className="w-full h-auto">
              <img
                src={URL.createObjectURL(item.name)}
                alt={`image${item.id}`}
                className="w-full h-full rounded-lg"
              />
            </div>
          ))}
        </>
      )}
      {listObjectImage.length === 2 && (
        <div className="grid grid-cols-2 h-full">
          {listObjectImage.map((item) => (
            <div key={item.id}>
              <img
                src={URL.createObjectURL(item.name)}
                alt={`image${item.id}`}
                className="h-full rounded-lg object-cover"
              />
            </div>
          ))}
        </div>
      )}
      {listObjectImage.length === 3 && (
        <div className="grid grid-cols-2 grid-rows-2 h-[466px]">
          {listObjectImage.map((item) => (
            <>
              {item.id === 0 && (
                <div key={item.id} className="col-span-2 h-auto">
                  <img
                    src={URL.createObjectURL(item.name)}
                    alt={`image${item.id}`}
                    className="h-full rounded-lg object-cover"
                  />
                </div>
              )}
              {item.id !== 0 && (
                <div key={item.id} className="w-full h-auto">
                  <img
                    src={URL.createObjectURL(item.name)}
                    alt={`image${item.id}`}
                    className="w-full h-full rounded-lg object-cover"
                  />
                </div>
              )}
            </>
          ))}
        </div>
      )}
      {listObjectImage.length === 4 && (
        <div className="grid grid-cols-2 grid-rows-2 h-[388.333px]">
          {listObjectImage.map((item) => (
            <div key={item.id} className="col-span-1 h-auto">
              <img
                src={URL.createObjectURL(item.name)}
                alt={`image${item.id}`}
                className="w-full h-full rounded-lg object-cover"
              />
            </div>
          ))}
        </div>
      )}
      {listObjectImage.length >= 5 && (
        <div className="grid grid-rows-2 h-[388.333px]">
          <div className="grid grid-cols-2">
            {listObjectImage.slice(0, 2).map((item) => (
              <div key={item.id}>
                <img
                  src={URL.createObjectURL(item.name)}
                  alt={`image${item.id}`}
                  className="col-span-1 rounded-lg h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3">
            {listObjectImage.slice(2, listObjectImage.length).map((item) => (
              <>
                <div
                  key={item.id}
                  className={`${item.id === 2 ? "relative" : ""} ${
                    item.id > 2 && "hidden"
                  }`}
                >
                  <img
                    src={URL.createObjectURL(item.name)}
                    alt={`image${item.id}`}
                    className="col-span-1 rounded-lg h-full w-full object-cover"
                  />
                  {listObjectImage.length > 5 && item.id === 2 && (
                    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                      <span className="text-white text-[40px]">
                        +{listObjectImage.length - 4}
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
