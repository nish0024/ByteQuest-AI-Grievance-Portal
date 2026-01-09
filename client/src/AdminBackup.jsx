const fetchGrievances = async () => {
    setLoading(true);
    setError(null);
    try {
      // Direct call to your verified Render endpoint
      const response = await fetch('https://bytequest-portal-backend.onrender.com/api/grievances');
      
      if (!response.ok) {
         throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      setGrievances(data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError('Server is waking up or unreachable. Please refresh in 30 seconds.');
      // Keep your demo data fallback here so the UI doesn't look broken
      setGrievances([...]); 
    } finally {
      setLoading(false);
    }
  };