import {Dialog} from "@components/app/dialog/dialog";

export interface InvalidDialogProps {
    isOpen: boolean;
    content: string;
    title: string;
}
export function InvalidDialog({ isOpen, content, title }: InvalidDialogProps) {
    return (
        <Dialog isOpen={isOpen}>
            <div className="max-w-md mx-auto rounded-xl p-6 bg-[#2e2e2e] border border-red-600 shadow-2xl">
                <div className="flex items-start gap-4">
                    <div className="text-red-500 text-2xl mt-1">⛔</div>
                    <div>
                        <h2 className="text-white text-lg font-bold mb-2 tracking-wide">
                            {title ?? 'Something went wrong'}
                        </h2>
                        {content && <p className="text-gray-300 leading-relaxed">{content}</p>}
                    </div>
                </div>
            </div>
        </Dialog>
    );
}

