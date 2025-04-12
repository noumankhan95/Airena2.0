export default function GoLiveButton({
  influencerId,
  influencerName,
}: {
  influencerId: string;
  influencerName: string;
}) {
  const handleGoLive = async () => {
 
    await fetch("/api/sendNotifications", {
      method: "POST",
      body: JSON.stringify({
        influencerId,
        influencerName,
      }),
    });
  };

  return (
    <button type="submit" onClick={handleGoLive}>
      Go Live
    </button>
  );
}
