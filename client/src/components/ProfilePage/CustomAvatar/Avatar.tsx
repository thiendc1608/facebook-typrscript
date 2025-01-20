import React, { useState, useRef } from "react";

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from "react-image-crop";
import { canvasPreview } from "./canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect";

import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { showModal } from "@/redux/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import "./CustomAvatar.css";
import { setAvatar, UserState } from "@/redux/userSlice";
import { userAPI } from "@/apis/userApi";
import { toast } from "react-toastify";

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const Avatar = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const blobUrlRef = useRef("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  async function handleClickSaveAvatar() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );
    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);
    dispatch(setAvatar(blobUrlRef.current));
    dispatch(
      showModal({
        isShowModal: false,
        childrenModal: null,
      })
    );
    const response = await userAPI.changeAvatar(
      { avatar: blobUrlRef.current },
      currentUser!.id
    );
    if (response) {
      toast.success(response.message);
    }
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale
        );
      }
    },
    100,
    [completedCrop, scale]
  );

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined);
    } else {
      setAspect(16 / 9);

      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, 16 / 9);
        setCrop(newCrop);
        // Updates the preview
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
      }
    }
  }

  return (
    <div className="App">
      <div className="Crop-Controls">
        <input type="file" accept="image/*" onChange={onSelectFile} />
        <div className="flex items-center gap-4">
          <div>
            <label htmlFor="scale-input">Scale: </label>
            <input
              id="scale-input"
              type="number"
              step="0.1"
              value={scale}
              disabled={!imgSrc}
              onChange={(e) => setScale(Number(e.target.value))}
              className="border border-black w-10"
            />
          </div>
          <div>
            <button
              className="border border-black p-1 rounded-md"
              onClick={handleToggleAspectClick}
            >
              Toggle aspect {aspect ? "off" : "on"}
            </button>
          </div>
        </div>
      </div>
      {!!imgSrc && (
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspect}
          // minWidth={400}
          minHeight={100}
          // circularCrop
        >
          <img
            ref={imgRef}
            alt="Crop me"
            src={imgSrc}
            style={{ transform: `scale(${scale})` }}
            onLoad={onImageLoad}
          />
        </ReactCrop>
      )}
      {!!completedCrop && (
        <>
          <div>
            <canvas
              ref={previewCanvasRef}
              style={{
                border: "1px solid black",
                objectFit: "contain",
                width: completedCrop.width,
                height: completedCrop.height,
              }}
            />
          </div>
          <div className="relative w-full h-[50px] flex items-center justify-end gap-4">
            <Button
              variant={"ghost"}
              className="w-[50px] text-blue-600 text-[15px] hover:bg-[#F2F2F2]"
              onClick={(e) => {
                e.stopPropagation();
                Swal.fire({
                  title: "Bỏ thay đổi",
                  text: "Bạn có chắc chắn muốn bỏ các thay đổi không?",
                  icon: "info",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Bỏ",
                  cancelButtonText: "Huỷ",
                }).then((result) => {
                  if (result.isConfirmed) {
                    dispatch(
                      showModal({
                        isShowModal: false,
                        childrenModal: null,
                      })
                    );
                  }
                });
              }}
            >
              Huỷ
            </Button>
            <Button
              className="w-[100px] bg-[#1864F8] text-white text-[15px] hover:bg-blue-700"
              onClick={handleClickSaveAvatar}
            >
              Lưu
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Avatar;
