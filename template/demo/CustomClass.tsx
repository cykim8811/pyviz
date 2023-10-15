
export default function CustomClass(props: { target: object }) {
    return (
        <div>
        <pre>{JSON.stringify(props.target, null, 2)}</pre>
        </div>
    )
}