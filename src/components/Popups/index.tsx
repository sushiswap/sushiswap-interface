import { FC } from "react";
import { useActivePopups } from "../../state/application/hooks";
import { useURLWarningVisible } from "../../state/user/hooks";
import PopupItem from "./PopupItem";

const Popups: FC = () => {
  const activePopups = useActivePopups();
  const urlWarningActive = useURLWarningVisible();

  return (
    <>
      <div
        className={`hidden md:block fixed right-[36px] max-w-[355px] w-full h-full z-3 flex flex-col ${
          urlWarningActive ? "top-[108px]" : "top-[88px]"
        }`}
      >
        {activePopups.map((item) => (
          <PopupItem
            key={item.key}
            content={item.content}
            popKey={item.key}
            removeAfterMs={item.removeAfterMs}
          />
        ))}
      </div>
      <div
        className={`fixed md:hidden relative m-w-full top-[88px] ${
          activePopups?.length > 0 ? "fit-content mx-auto mb-[20px]" : 0
        }`}
      >
        <div
          className="h-[99%] overflow-x-auto overflow-y-hidden flex flex-col gap-4"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {activePopups // reverse so new items up front
            .slice(0)
            .reverse()
            .map((item) => (
              <PopupItem
                key={item.key}
                content={item.content}
                popKey={item.key}
                removeAfterMs={item.removeAfterMs}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default Popups;
