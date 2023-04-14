const FIRE_EMOJI = <>&#x1f525;</>;
const SPARKLES_EMOJI = <>&#x2728;</>;
export const ErrorAlert = ({
  children,
}: {
  children: JSX.Element | string;
}) => {
  return (
    <div className="alert alert-danger" role="alert">
      {FIRE_EMOJI} <strong>Error:</strong> {children}
    </div>
  );
};

export const SuccessAlert = ({
  children,
}: {
  children: JSX.Element[] | JSX.Element | string;
}) => {
  return (
    <div className="alert alert-success" role="alert">
      {SPARKLES_EMOJI} <strong>Success!</strong> {children}
      <i className="bi bi-clipboard" onClick={() => { }}></i>
    </div>
  );
};
