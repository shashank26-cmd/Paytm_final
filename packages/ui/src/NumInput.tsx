"use client"

export const NumInput = ({
    placeholder,
    onChange,
    label
}: {
    placeholder: string;
    onChange: (value: number) => void;
    label: string;
}) => {
    return <div className="pt-2">
        <label className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
        <input onChange={(e) => onChange(Number(e.target.value))} type="number" id="idk" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} />
    </div>
}