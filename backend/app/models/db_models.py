from sqlalchemy import Column, String, Float, Integer, Text
from app.database import Base

class DBIncident(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, index=True)
    code = Column(String, index=True)
    location = Column(String)
    dmaZone = Column(String)
    severity = Column(String)
    confidence = Column(Float)
    estimatedLossGpm = Column(Float)
    estimatedDailyCost = Column(Float)
    detectedTime = Column(String)
    status = Column(String)
    pipeType = Column(String)
    pipeDiameter = Column(String)
    acousticFreq = Column(Float)
    pressureDropPsi = Column(Float)
    assignedCrew = Column(String, nullable=True)
    summary = Column(Text)
    repairPriority = Column(Integer, nullable=True)
    recommendedAction = Column(Text, nullable=True)
    suspectedSegment = Column(String, nullable=True)

class DBNetworkNode(Base):
    __tablename__ = "network_nodes"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)
    x = Column(Float)
    y = Column(Float)
    status = Column(String)
    pressurePsi = Column(Float)
    flowGpm = Column(Float)
    zone = Column(String)
    batteryLevel = Column(Float, nullable=True)
    lastPing = Column(String, nullable=True)

class DBPipeSegment(Base):
    __tablename__ = "pipe_segments"

    id = Column(String, primary_key=True, index=True)
    fromNodeId = Column(String)
    toNodeId = Column(String)
    status = Column(String)
    flowDirection = Column(String)
    diameterInches = Column(Float)
    lengthMeters = Column(Float)
    flowRateGpm = Column(Float)

class DBDMAZone(Base):
    __tablename__ = "dma_zones"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    totalSensors = Column(Integer)
    activeLeaks = Column(Integer)
    avgPressurePsi = Column(Float)
    waterLossRate = Column(Float)
