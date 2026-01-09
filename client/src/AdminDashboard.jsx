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
      // Success: Populate state with real data from MongoDB Atlas
      setGrievances(data); 
    } catch (err) {
      console.error("Fetch Error:", err);
      setError('Server is waking up or unreachable. Displaying demo data...');
      
      // Fallback: Populate state with demo data so the UI isn't empty
      setGrievances([
        {
          _id: 'DEMO101',
          citizenName: 'System Demo User',
          category: 'Infrastructure',
          priority: 'medium',
          status: 'pending',
          aiSummary: 'Example grievance for UI testing during server wake-up.',
          description: 'This is demo data because the server is currently spinning up.',
          createdAt: new Date().toISOString()
        }
      ]); 
    } finally {
      setLoading(false);
    }
  } ;