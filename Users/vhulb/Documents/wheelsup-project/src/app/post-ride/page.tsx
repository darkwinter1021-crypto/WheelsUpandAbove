
import { PostRideForm } from '../../components/post-ride-form';

export default function PostRidePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold font-headline">Post a New Ride</h1>
          <p className="text-muted-foreground mt-2">Share your upcoming trip and find passengers.</p>
        </div>
        <PostRideForm />
      </div>
    </div>
  );
}
