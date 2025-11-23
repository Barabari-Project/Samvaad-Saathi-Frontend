"use client";
import { ArrowsPointingOutIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useRef } from "react";

interface CodeViewProps {
  code?: string;
  fileName?: string;
}

const CodeView: React.FC<CodeViewProps> = ({
  code = `import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return () => <div>$0</div>
  },
})`,
  fileName = "Demo.jsx",
}) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <div className="w-full max-w-2xl my-4">
        {/* Card Container */}
        <div className="card bg-[#1e1e1e] shadow-xl rounded-lg overflow-hidden border border-gray-800">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-2 bg-[#252526] border-b border-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-blue-400 text-sm">⚛</span>
              <span className="text-gray-400 text-sm">{fileName}</span>
            </div>
            <button
              onClick={() => modalRef.current?.showModal()}
              className="btn btn-ghost btn-xs btn-square text-gray-400 hover:text-white tooltip tooltip-left"
              data-tip="Expand"
            >
              <ArrowsPointingOutIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Code Preview */}
          <div
            className="p-4 relative group cursor-pointer"
            onClick={() => modalRef.current?.showModal()}
          >
            <pre className="font-mono text-sm leading-relaxed text-gray-300 overflow-hidden max-h-32">
              <code>{code}</code>
            </pre>
            {/* Gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#1e1e1e] to-transparent pointer-events-none flex items-end justify-center pb-2">
              <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to expand
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box w-11/12 max-w-5xl bg-[#1e1e1e] p-0 text-left rounded-lg border border-gray-700">
          {/* Modal Header */}
          <div className="flex justify-between items-center px-4 py-3 bg-[#252526] border-b border-gray-800 sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <span className="text-blue-400 text-sm">⚛</span>
              <span className="text-gray-400 font-medium">{fileName}</span>
            </div>
            <form method="dialog">
              <button className="btn btn-ghost btn-sm btn-square text-gray-400 hover:text-white">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Full Code */}
          <div className="p-6 overflow-x-auto">
            <pre className="font-mono text-sm leading-relaxed text-gray-300">
              <code>{code}</code>
            </pre>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default CodeView;
